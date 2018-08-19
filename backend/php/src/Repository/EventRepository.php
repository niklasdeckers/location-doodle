<?php

namespace App\Repository;

use App\Model\Event;
use App\Model\Participant;
use Doctrine\DBAL\Connection;

class EventRepository
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @param Event $event
     * @throws \Doctrine\DBAL\DBALException
     */
    public function save(Event $event)
    {
        $statement = $this->connection->prepare(
            '
            INSERT INTO
                event 
                (displayname, category, invitation_code, event_time, creator, output_cache) 
            VALUES 
                (:displayname, :category, :invitation_code,:event_time,:creator, :output_cache)
            ON DUPLICATE KEY UPDATE displayname = :displayname, category = :category, output_cache = :output_cache
            ;
            '
        );

        $statement->bindValue('displayname', $event->displayName);
        $statement->bindValue('category', $event->topic);
        $statement->bindValue('invitation_code', $event->eventId);
        $statement->bindValue('event_time', $event->startTime->format('Y-m-d H:i:s'));
        $statement->bindValue('creator', $event->creatorId);
        $statement->bindValue('output_cache', $event->output_cache);
        $statement->execute();

        foreach ($event->participants as $participant) {
            $statement = $this->connection->prepare(
                '
                INSERT INTO participation (client, event, location, displayname) 
                VALUES  :client, :event, :location, :displayname);
                '
            );

            $statement->bindValue('client', $participant->auth_token);
            $statement->bindValue('event', $event->eventId);
            $statement->bindValue('location', serialize($participant->location));
            $statement->bindValue('displayname', $participant->displayName);
            $statement->execute();
        }
    }


    /**
     * @param string $eventId
     *
     * @return Event
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getEvent($eventId)
    {
        $event = $this->findEvent($eventId);

        return $event;
    }

    /**
     * @param $eventId
     * @return Event
     * @throws \Doctrine\DBAL\DBALException
     */
    private function findEvent($eventId)
    {
        $statement = $this->connection->prepare('SELECT * FROM event where invitation_code = :event;');
        // Set parameters
        $statement->bindValue('event', $eventId);
        $statement->execute();

        $result = $statement->fetchAll();

        if (count($result) === 0) {
            return null;
        }

        $row = $result[0];
        $event = new Event(
            $row['creator'],
            new \DateTime($row['event_time']),
            $row['displayname'],
            $row['category']
        );
        $event->eventId = $eventId;
        $event->output_cache = $row['output_cache'];

        $this->attachParticipants($event);

        return $event;
    }

    /**
     * @param Event $event
     * @throws \Doctrine\DBAL\DBALException
     */
    private function attachParticipants(Event $event)
    {
        $statement = $this->connection->prepare('SELECT * FROM participation where event = :event;');
        // Set parameters
        $statement->bindValue('event', $event->eventId);
        $statement->execute();

        foreach ($statement->fetchAll() as $row) {
            $participant = new Participant(
                $row['displayname'],
                unserialize($row['location']),
                $row['client']
            );
            $participant->setEventId($event->eventId);

            $event->participants[] = $participant;
        }
    }
}
