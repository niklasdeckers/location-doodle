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
     * @var boolean
     */
    public $isInvitor;

    /**
     * @param string $displayName
     * @param array $location
     * @param $isInvitor
     */
    public function __construct($displayName, array $location, $isInvitor)
    {
        foreach ($location as $key => $value) {
            $location[$key] = (float) $value;
        }

        $this->displayName = $displayName;
        $this->location = $location;
        $this->isInvitor = $isInvitor;
    }

    /**
     * @return Participant
     */
    public static function getMockedInvitor()
    {
        return new self('John Doe', ['lat' => 52.520008, 'lng' => 13.404954], true);
    }

    /**
     * @return Participant
     */
    public static function getMockedParticipant()
    {
        return new self('Jane Doe', ['lat' => 52.520008, 'lng' => 13.404954], false);
    }
}
