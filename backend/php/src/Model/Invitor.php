<?php

namespace App\Model;

class Invitor
{
    /**
     * @var string
     */
    private $displayName;

    /**
     * @var array (lat;lon)
     */
    private $location;

    /**
     * @param string $displayName
     * @param array $location
     */
    public function __construct($displayName, array $location)
    {
        $this->displayName = $displayName;
        $this->location = $location;
    }
}
