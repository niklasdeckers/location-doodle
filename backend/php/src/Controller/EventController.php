<?php

namespace App\Controller;

use App\Model\Event;
use App\Model\Participant;
use App\Repository\EventRepository;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

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
     */
    public function getEventAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        //TODO move somewhere else
        $em = $this->getDoctrine()->getManager();

        $RAW_QUERY = 'SELECT * FROM participation where client = :client and event = :event;';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('client', $request->headers->get(self::HEADER_AUTHORIZATION));
        $statement->bindValue('event', $eventId);
        $statement->execute();

        $result = $statement->fetchAll();
        if(!$result){
            throw new AccessDeniedHttpException();
        }

        $event = Event::getEventFromDB($eventId);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     * @param string $eventId
     *
     * @return JsonResponse
     *
     * subscribe to event (accept invitation via multi-use link)
     */
    public function postEventParticipantAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        $name = $request->get(self::PARAM_PARTICIPANT_DISPLAY_NAME);
        $location = $request->get(self::PARAM_PARTICIPANT_LOCATION);
        $participant = new Participant($name, $location, $request->headers->get(self::HEADER_AUTHORIZATION));

        $event = Event::getEventFromDB($eventId);
        $event->addParticipantToDB($participant);

        return new JsonResponse($event);
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
