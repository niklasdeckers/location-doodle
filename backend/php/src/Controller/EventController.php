<?php

namespace App\Controller;

use App\Model\Event;
use App\Model\Participant;
use App\Model\SuggestedLocation;
use App\Repository\EventRepository;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EventController extends FOSRestController
{
    const HEADER_AUTHORIZATION = 'Authorization';

    const PARAM_PARTICIPANT_DISPLAY_NAME = 'participant_display_name';
    const PARAM_PARTICIPANT_LOCATION = 'participant_location';

    const PARAM_EVENT_START_TIME = 'event_start_time';
    const PARAM_EVENT_DISPLAY_NAME = 'event_display_name';
    const PARAM_EVENT_TOPIC = 'event_topic';

    /**
     * @var EventRepository
     */
    private $eventRepository;

    /**
     * @param EventRepository $eventRepository
     */
    public function __construct(EventRepository $eventRepository)
    {
        $this->eventRepository = $eventRepository;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     *
     * Create new event (calls background method)
     * @throws \Doctrine\DBAL\DBALException
     */
    public function postEventAction(Request $request)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        $event = $this->createEventByRequest($request);
        $this->eventRepository->save($event);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     * @param string $eventId
     *
     * @return JsonResponse
     *
     * get all data needed for displaying subscribed event
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getEventAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }
        $event = $this->eventRepository->getEvent($eventId);
        if (is_null($event)) {
            throw  new NotFoundHttpException();
        }

        $authToken = $request->headers->get(self::HEADER_AUTHORIZATION);
        if(!$event->isParticipant($authToken)){
            //throw new AccessDeniedHttpException(); - allow for presentation
        }

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     * @param string $eventId
     *
     * @return JsonResponse
     *
     * subscribe to event (accept invitation via multi-use link)
     * @throws \Doctrine\DBAL\DBALException
     */
    public function postEventParticipantAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        $name = $request->get(self::PARAM_PARTICIPANT_DISPLAY_NAME);
        $location = $request->get(self::PARAM_PARTICIPANT_LOCATION);
        $participant = new Participant($name, $location, $request->headers->get(self::HEADER_AUTHORIZATION));

        $event = $this->eventRepository->getEvent($eventId);
        if (is_null($event)) {
            throw  new NotFoundHttpException();
        }

        $event->addParticipant($participant);
        $this->eventRepository->save($event);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     * @param string $eventId
     * @return JsonResponse
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getEventSuggestAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        $event = $this->eventRepository->getEvent($eventId);
        if (is_null($event) || is_null($event->output_cache)) {
            throw  new NotFoundHttpException();
        }

        $authToken = $request->headers->get(self::HEADER_AUTHORIZATION);
        if(!$event->isParticipant($authToken)){
            throw new AccessDeniedHttpException();
        }


        $suggestedLocation = new SuggestedLocation(
            $event->output_cache[0]->Stn[0]->name,
            [
                'lat' => (float) $event->output_cache[0]->Stn[0]->y,
                'lng' => (float) $event->output_cache[0]->Stn[0]->x
            ],
            'pending'
        );

        return new JsonResponse($suggestedLocation);
    }

    /**
     * @param Request $request
     *
     * @return Event
     */
    private function createEventByRequest(Request $request)
    {
        $creatorId = $request->headers->get(self::HEADER_AUTHORIZATION);
        $startTime = new \DateTime($request->get(self::PARAM_EVENT_START_TIME));
        $displayName = $request->get(self::PARAM_EVENT_DISPLAY_NAME);
        $topic = $request->get(self::PARAM_EVENT_TOPIC);

        $event = new Event(
            $creatorId,
            $startTime,
            $displayName,
            $topic
        );

        return $event;
    }
}
