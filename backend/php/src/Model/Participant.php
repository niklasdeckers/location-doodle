<?php

namespace App\Model;

class Participant
{
    /**
     * @var string
     */
    public $displayName;

    /**
     * @var array (lat;lon)
     */
    public $location;

    /**
     * @var string
     */
    public $auth_token;

    /**
     * @var string
     */
    private $eventId;

    /**
     * @param string $displayName
     * @param array $location
     * @param string $auth_token
     */
    public function __construct($displayName, array $location, $auth_token)
    {
        foreach ($location as $key => $value) {
            $location[$key] = (float) $value;
        }

        $this->displayName = $displayName;
        $this->location = $location;
        $this->auth_token = $auth_token;
    }

    /**
     * @return string
     */
    public function getEventId()
    {
        return $this->eventId;
    }

    /**
     * @param string $eventId
     */
    public function setEventId($eventId)
    {
        $this->eventId = $eventId;
    }
}
