<?php

namespace App\Model;

class SuggestedLocation
{
    /**
     * @var string
     */
    public $station;

    /**
     * @var array
     */
    public $location;

    /**
     * @var string
     */
    public $title;

    /**
     * @param string $station
     * @param array $location
     * @param string $title
     */
    public function __construct($station, array $location, $title)
    {
        $this->station = $station;
        $this->location = $location;
        $this->title = $title;
    }
}
