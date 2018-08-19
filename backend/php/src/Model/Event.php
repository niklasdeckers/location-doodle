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
    public $creator_id;

    /**
     * @var string
     */
    public $topic;

    /**
     * @var string
     */
    public $output_cache;

    /**
     * @param string $creator_id
     * @param \DateTime $startTime
     * @param string $displayName
     * @param string $topic
     */
    public function __construct(
        $creator_id,
        \DateTime $startTime,
        $displayName,
        $topic
    ) {
        $this->participants = [];
        $this->startTime = $startTime;
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

        $em = $this->getDoctrine()->getManager();

        $RAW_QUERY = 'INSERT INTO participation (client,event,location,displayname) VALUES (:client,:event,:location,:displayname);';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('client',$participant->auth_token );
        $statement->bindValue('event',$this->eventId );
        $statement->bindValue('location', $participant->location);
        $statement->bindValue('displayname', $participant->displayName);
        $statement->execute();


        $RAW_QUERY = 'SELECT location FROM participation where event = :event;';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('event', $this->eventId);
        $statement->execute();

        $result = $statement->fetchAll();

        $url="http://localhost:28282?arrival_time=".$this->startTime."&starting_locations=".json_encode($result);
        $python_out = file_get_contents($url);

        $RAW_QUERY = 'UPDATE event SET output_cache = :output_cache WHERE invitation_code = :invitation_code;';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('output_cache',$python_out );
        $statement->bindValue('invitation_code',$this->eventId );
        $statement->execute();

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
        $em = $this->getDoctrine()->getManager();

        $RAW_QUERY = 'SELECT * FROM event where invitation_code = :event;';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('event', $eventId);
        $statement->execute();

        $result = $statement->fetchAll();
        $row=$result[0];

        $event = new self(
            $row["creator"],
            $row["event_time"],
            $row["displayname"],
            $row["category"]
        );
        $event->eventId = $eventId;
        $event->output_cache=$row["output_cache"];

        return $event;
    }

    /**
     * @param Participant $participant
     * @return bool
     */
    private function hasParticipant(Participant $participant)
    {

        $em = $this->getDoctrine()->getManager();

        $RAW_QUERY = 'SELECT * FROM participation where client = :client and event = :event;';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('client', $participant->auth_token);
        $statement->bindValue('event', $this->eventId);
        $statement->execute();

        $result = $statement->fetchAll();
        if(!$result){
            return false;
        }
        return true;
    }

    public function writeToDB(){

        $em = $this->getDoctrine()->getManager();

        $RAW_QUERY = 'INSERT INTO event (displayname,category,invitation_code,event_time,creator) VALUES (:displayname,:category,:invitation_code,:event_time,:creator);';

        $statement = $em->getConnection()->prepare($RAW_QUERY);
        // Set parameters
        $statement->bindValue('displayname', $this->displayName);
        $statement->bindValue('category', $this->topic);
        $statement->bindValue('invitation_code', $this->eventId);
        $statement->bindValue('event_time', $this->startTime);
        $statement->bindValue('creator', $this->creator_id);
        $statement->execute();

    }
}
