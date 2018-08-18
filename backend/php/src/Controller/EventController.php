<?php

namespace App\Controller;

use App\Model\Event;
use App\Model\Invitor;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EventController extends FOSRestController
{
    const HEADER_AUTHORIZATION = 'Authorization';

    const PARAM_INVITOR_DISPLAY_NAME = 'invitor_display_name';
    const PARAM_INVITOR_LOCATION = 'invitor_location';

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

        $event = $this->getEventByRequest($request);

        return new JsonResponse($event);
    }

    /**
     * @param Request $request
     *
     * @return Event
     */
    private function getEventByRequest(Request $request)
    {
        $invitorName = $request->get(self::PARAM_INVITOR_DISPLAY_NAME);
        $location = $request->get(self::PARAM_INVITOR_LOCATION);
        $invitor = new Invitor($invitorName, $location);

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
