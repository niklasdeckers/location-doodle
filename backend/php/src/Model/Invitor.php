<?php

namespace App\Model;

class Invitor
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
     * @param string $displayName
     * @param array $location
     */
    public function __construct($displayName, array $location)
    {
        $this->displayName = $displayName;
        $this->location = $location;
    }

    /**
     * @return Invitor
     */
    public static function getMockedInvitor()
    {
        return new self('John Doe', ['lat' => 52.520008, 'lng' => 13.404954]);
    }
}
