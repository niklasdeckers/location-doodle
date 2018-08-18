<?php

namespace App\Model;

class Event
{
    /**
     * @var string
     */
    public $eventId;

    /**
     * @var Participant[]
     */
    public $participants;

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
     * @param Participant $invitor
     * @param \DateTime $startTime
     * @param \DateTime $subscriptionDeadline
     * @param string $displayName
     * @param string $topic
     */
    public function __construct(
        Participant $invitor,
        \DateTime $startTime,
        \DateTime $subscriptionDeadline,
        $displayName,
        $topic
    ) {
        $this->participants = [$invitor];
        $this->startTime = $startTime;
        $this->subscriptionDeadline = $subscriptionDeadline;
        $this->displayName = $displayName;
        $this->topic = $topic;

        $this->eventId = '123456'; // TODO: ReplaceMe with logic
    }

    /**
     * @param Participant $participant
     */
    public function addParticipant(Participant $participant)
    {
        if ($this->hasParticipant($participant)) {
            return;
        }

        $this->participants[] = $participant;
    }

    /**
     * @param string $eventId
     *
     * @return Event
     */
    public static function getMockedEvent($eventId)
    {
        $event = new self(
            Participant::getMockedInvitor(),
            new \DateTime('+2  Weeks'),
            new \DateTime('tomorrow'),
            'Kugel schieben mit den Jungs',
            'Fussball'
        );
        $event->eventId = $eventId;

        return $event;
    }

    /**
     * @param Participant $participant
     * @return bool
     */
    private function hasParticipant(Participant $participant)
    {
        // TODO: check if participant is already added (maybe by AuthToken?)
        return false;
    }
}
