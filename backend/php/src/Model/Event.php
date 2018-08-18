<?php

namespace App\Model;

class Event
{
    /**
     * @var string
     */
    public $eventId;

    /**
     * @var Invitor
     */
    public $invitor;

    /**
     * @var \DateTime
     */
    public $startTime;

    /**
     * @var \DateTime
     */
    public $subscriptionDeadline;

    /**
     * @var string
     */
    public $displayName;

    /**
     * @var string
     */
    public $topic;

    /**
     * @param Invitor $invitor
     * @param \DateTime $startTime
     * @param \DateTime $subscriptionDeadline
     * @param string $displayName
     * @param string $topic
     */
    public function __construct(
        Invitor $invitor,
        \DateTime $startTime,
        \DateTime $subscriptionDeadline,
        $displayName,
        $topic
    ) {
        $this->invitor = $invitor;
        $this->startTime = $startTime;
        $this->subscriptionDeadline = $subscriptionDeadline;
        $this->displayName = $displayName;
        $this->topic = $topic;

        $this->eventId = '123456'; // TODO: ReplaceMe with logic
    }

    /**
     * @param string $eventId
     *
     * @return Event
     */
    public static function getMockedEvent($eventId)
    {
        $event = new self(
            Invitor::getMockedInvitor(),
            new \DateTime('+2  Weeks'),
            new \DateTime('tomorrow'),
            'Kugel schieben mit den Jungs',
            'Fussball'
        );
        $event->eventId = $eventId;

        return $event;
    }
}
