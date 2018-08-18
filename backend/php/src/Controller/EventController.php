<?php

namespace App\Controller;

use App\Model\Event;
use App\Model\Participant;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EventController extends FOSRestController
{
    const HEADER_AUTHORIZATION = 'Authorization';

    const PARAM_INVITOR_DISPLAY_NAME = 'invitor_display_name';
    const PARAM_INVITOR_LOCATION = 'invitor_location';

    const PARAM_PARTICIPANT_DISPLAY_NAME = 'participant_display_name';
    const PARAM_PARTICIPANT_LOCATION = 'participant_location';

    const PARAM_EVENT_SUBSCRIPTION_DEADLINE = 'event_subscription_deadline';
    const PARAM_EVENT_START_TIME = 'event_start_time';
    const PARAM_EVENT_DISPLAY_NAME = 'event_display_name';
    const PARAM_EVENT_TOPIC = 'event_topic';

    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function postEventAction(Request $request)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        $event = $this->createEventByRequest($request);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     * @param string $eventId
     *
     * @return JsonResponse
     */
    public function getEventAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }


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


        $event=getEventFromDB($eventId);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     * @param string $eventId
     *
     * @return JsonResponse
     */
    public function postEventParticipantAction(Request $request, $eventId)
    {
        if (!$request->headers->has(self::HEADER_AUTHORIZATION)) {
            throw new AccessDeniedHttpException();
        }

        $name = $request->get(self::PARAM_PARTICIPANT_DISPLAY_NAME);
        $location = $request->get(self::PARAM_PARTICIPANT_LOCATION);
        $participant = new Participant($name, $location, false);

        $event = Event::getMockedEvent($eventId);
        $event->addParticipant($participant);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     *
     * @return Event
     */
    private function createEventByRequest(Request $request)
    {
        $invitorName = $request->get(self::PARAM_INVITOR_DISPLAY_NAME);
        $location = $request->get(self::PARAM_INVITOR_LOCATION);
        $invitor = new Participant($invitorName, $location, true);

        $startTime = new \DateTime($request->get(self::PARAM_EVENT_START_TIME));
        $subscriptionDeadline = new \DateTime($request->get(self::PARAM_EVENT_SUBSCRIPTION_DEADLINE));
        $displayName = $request->get(self::PARAM_EVENT_DISPLAY_NAME);
        $topic = $request->get(self::PARAM_EVENT_TOPIC);

        $event = new Event(
            $invitor,
            $startTime,
            $subscriptionDeadline,
            $displayName,
            $topic
        );

        return $event;
    }
}
