<?php

namespace App\Repository;

use App\Model\Event;
use App\Model\Participant;
use Doctrine\DBAL\Connection;
use Psr\Log\LoggerInterface;
use Psr\Log\Test\LoggerInterfaceTest;

class EventRepository
{
    /**
     * @var Connection
     */
    private $connection;
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @param Connection $connection
     * @param LoggerInterface $logger
     */
    public function __construct(Connection $connection, LoggerInterface $logger)
    {
        $this->connection = $connection;
        $this->logger = $logger;
    }

    /**
     * @param Event $event
     * @throws \Doctrine\DBAL\DBALException
     */
    public function save(Event $event)
    {
        $this->determineOutputCache($event);

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
                VALUES (:client, :event, :location, :displayname)
                ON DUPLICATE KEY UPDATE displayname = :displayname, location = :location
                ;
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
        $event->output_cache = json_decode($row['output_cache']);

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

    /**
     * @param Event $event
     */
    private function determineOutputCache(Event $event)
    {
        $locations = [];
        foreach ($event->participants as $participant) {
            $locations[] = '"' . $participant->location['lat'].','.$participant->location['lng'] . '"';
        }
        $locationsString = '[' . urldecode(implode(',', $locations)) . ']';

        if ($locationsString !== '[]') {
            $url = "http://backend_python:8080?arrival_time=".urlencode($event->startTime->format(
                    \DateTime::ISO8601
                ))."&starting_locations=" . $locationsString . "&topic=" . urlencode($event->topic);
            $this->logger->debug('<python_call>'.$url);
            $event->output_cache = @file_get_contents($url);
            $this->logger->debug('<python_result>'.$event->output_cache);
        } else {
            $this->logger->debug('<python_call> none');
        }
    }
}
