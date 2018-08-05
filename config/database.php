<?php
require_once 'constants.php';

class Database extends PDO
{
    
    private static $instance;

    public function __construct($DB_TYPE, $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS)
    {       
        try {
            parent::__construct($DB_TYPE.':host='.$DB_HOST.';dbname='.$DB_NAME.';charset=utf8', $DB_USER, $DB_PASS);
            $this->exec('SET CHARACTER SET utf8');

        } catch (PDOException $e) {
            die ( 'Connection failed: ' . $e->getMessage() );
        }
    }


    public static function getInstance() {
        if ( self::$instance === null )
            self::$instance = new self(DB_TYPE, DB_HOST, DB_NAME, DB_USER, DB_PASS);

        return self::$instance;
    }
    
  
    public function select($sql, $array = array(), $fetchMode = PDO::FETCH_ASSOC)
    {
        $db = self::getInstance();
        $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );    

        $sth = $db->prepare($sql);
        foreach ($array as $key => $value) {
            $sth->bindValue(":$key", $value);
        }
        
        $sth->execute();

        // echo $sql;
         // $sth->debugDumpParams();
        // print_r($db->errorInfo()); 
          // var_dump($sth);    
         //  exit();

        $result = $sth->fetchAll($fetchMode);

        $sth->closeCursor();

        return $result;
    }
    
   
    public function insert($table, $data)
    {
        $db = self::getInstance();
        $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );            

        ksort($data);
        
        $fieldNames = implode('`, `', array_keys($data));
        $fieldValues = ':' . implode(', :', array_keys($data));
        
        $sth = $db->prepare("INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues)");
        
        foreach ($data as $key => $value) {
            $sth->bindValue(":$key", $value);
        }
                
        $count = $sth->execute();  
        
        /*
        if($sth->errorCode() == 0) $error = true;
            
        else echo $sth->errorInfo()[2];
        */        

        // print_r($db->errorInfo()); 
        //  var_dump($sth);    
        $sth->closeCursor();  

        return $count;     
       
    }


    public function insertLastId($table,$data){
        $db = self::getInstance();
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

        ksort($data);

        $fieldNames = implode('`, `',array_keys($data));
        $fieldValues = ':'. implode(', :',array_keys($data));

        $sth = $db->prepare("INSERT INTO $table (`$fieldNames`) VALUES ($fieldValues)");

        foreach ($data as $key => $value){
            $sth->bindValue(":$key",$value);
        }

        $sth->execute();
        $idInserted = 0; // en caso de error, regresa id 0
        if($sth->errorCode() == 0)
            $idInserted =  $db->lastInsertId();
        //else echo $sth->errorInfo()[2];

        // print_r($db->errorInfo()); 
        //  var_dump($sth);    
        $sth->closeCursor();

        return $idInserted;
    }
    
   
    public function update($table, $data, $where, $whereBindArray = array())
    {
        $db = self::getInstance();

        ksort($data);
        
        $fieldDetails = NULL;
        
        foreach($data as $key=> $value) {
            $fieldDetails .= "`$key`=:$key,";
        }
        $fieldDetails = rtrim($fieldDetails, ',');
        
        $sth = $db->prepare("UPDATE $table SET $fieldDetails WHERE $where");
        
        foreach ($data as $key => $value) {
            $sth->bindValue(":$key", $value);
        }
        
        foreach ($whereBindArray as $key => $value) {
            $sth->bindValue(":$key", $value);
        }        
        
        $count = $sth->execute();

        $sth->closeCursor();

        return $count;
    }
    
  
    public function delete($table, $where, $bind = array(), $limit = 1)
    {
        $db = self::getInstance();

        $sth = $db->prepare("DELETE FROM $table WHERE $where LIMIT $limit");
        
        foreach ($bind as $key => $value) {
            $sth->bindValue(":$key", $value);
        }
        
        $count = $sth->execute();

        $sth->closeCursor();

        return $count;
    }

    public function deleteAll($table, $where, $bind = array())
    {
        $db = self::getInstance();

        $sth = $db->prepare("DELETE FROM $table WHERE $where ");
        
        foreach ($bind as $key => $value) {
            $sth->bindValue(":$key", $value);
        }
        
        $count = $sth->execute();

        $sth->closeCursor();

        return $count;
    }
}