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
