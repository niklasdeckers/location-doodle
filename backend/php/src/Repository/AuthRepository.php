<?php

namespace App\Repository;

use Doctrine\DBAL\Connection;

class AuthRepository
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
     * @return string
     * @throws \Doctrine\DBAL\DBALException
     */
    public function getAuthToken()
    {
        $uuid = $this->getUniqueIdentifier();

        $statement = $this->connection->prepare(
            'INSERT INTO client (auth_token) VALUES (:uuid);'
        );
        $statement->bindValue('uuid', $uuid);
        $statement->execute();

        return $uuid;
    }

    /**
     * @return string
     */
    private function getUniqueIdentifier()
    {
        $now = new \DateTime();

        return hash('sha512',uniqid($now->getTimestamp()));
    }
}
