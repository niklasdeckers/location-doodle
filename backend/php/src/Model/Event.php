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
     * @var string
     */
    public $displayName;

    /**
     * @var string
     */
    public $creatorId;

    /**
     * @var string
     */
    public $topic;

    /**
     * @var string
     */
    public $output_cache;

    /**
     * @param string $creatorId
     * @param \DateTime $startTime
     * @param string $displayName
     * @param string $topic
     */
    public function __construct(
        $creatorId,
        \DateTime $startTime,
        $displayName,
        $topic
    ) {
        $this->participants = [];

        $zone = new \DateTimeZone('Europe/Berlin');
        $startTime->setTimezone($zone);
        $this->startTime = $startTime;
        $this->displayName = $displayName;
        $this->topic = $topic;
        $this->output_cache = '';

        $this->eventId = $this->getEventIdentifier();
        $this->creatorId = $creatorId;
    }

    /**
     * @param Participant $participant
     */
    public function addParticipant(Participant $participant)
    {
        if (!$this->hasParticipant($participant->auth_token)) {
            $this->participants[] = $participant;
        }
    }

    /**
     * @param string $authToken
     *
     * @return bool
     */
    public function isParticipant($authToken)
    {
        if ($this->hasParticipant($authToken)) {
            return true;
        }

        return $this->creatorId === $authToken;
    }

    /**
     * @param string $authToken
     * @return bool
     */
    private function hasParticipant($authToken)
    {
        foreach ($this->participants as $tmpParticipant) {
            if ($tmpParticipant->auth_token === $authToken) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return string
     */
    private function getEventIdentifier()
    {
        $random_string_length = 6;
        $characters = 'abcdefghijkmnopqrstuvwxyz023456789';//omitted 1 and l
        $string = '';
        $max = strlen($characters) - 1;
        for ($i = 0; $i < $random_string_length; $i++) {
            $string .= $characters[mt_rand(0, $max)];
        }

        return $string;
    }
}
