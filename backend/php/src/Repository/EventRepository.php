<?php

namespace App\Repository;

use App\Model\Event;
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
            'INSERT INTO 
                event 
                (displayname, category, invitation_code, event_time, creator, output_cache) 
            VALUES 
                (:displayname, :category, :invitation_code,:event_time,:creator, \'\');
            '
        );

        $statement->bindValue('displayname', $event->displayName);
        $statement->bindValue('category', $event->topic);
        $statement->bindValue('invitation_code', $event->eventId);
        $statement->bindValue('event_time', $event->startTime->format('Y-m-d H:i:s'));
        $statement->bindValue('creator', $event->creatorId);
        $statement->execute();
    }
}
