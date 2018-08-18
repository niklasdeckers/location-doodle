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

        $random_string_length=6;
        $characters = 'abcdefghijkmnopqrstuvwxyz023456789';//omitted 1 and l
        $string = '';
        $max = strlen($characters) - 1;
        for ($i = 0; $i < $random_string_length; $i++) {
            $string .= $characters[mt_rand(0, $max)];
        }
        $this->eventId = $string;
    }

    /**
     * @param Participant $participant
     */
    public function addParticipantToDB(Participant $participant)
    {
        if ($this->hasParticipant($participant)) {
            return;
        }

        //TODO DB logic


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
     * @param string $eventId
     *
     * @return Event
     */
    public static function getEventFromDB($eventId)
    {

//TODO db logic
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

        //TODO db logic
        // TODO: check if participant is already added (maybe by AuthToken?)
        return false;
    }

    public function writeToDB(){

        //todo db logic
    }
}
