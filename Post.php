<?php

session_start();

class Post {
  private $_db;

  public function __construct () {
    try {
      // CRSF
      $this-> _createToken();
      // connect
      $this->_db = new PDO(PDO_DSN,DB_USERNAME,DB_PASSWORD);
      $this->_db->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
      echo $e->getMessage();
      exit;
    }
  }

  private function _createToken() {
    if(!isset($_SESSION['token'])){
      $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(16));
    }
  }

  private function _validateToken() {
    if(!isset($_SESSION['token']) || !isset($_POST['token']) || $_SESSION['token'] !== $_POST['token']){
      throw new Exception('invalid token !');
    }
  }

  private function _validatePost() {
    if(!isset($_POST['name']) || $_POST['name'] === '' ) {
      throw new Exception('Please fill out your name !');
    }
    if(mb_strlen($_POST['name'], 'utf-8') > 15){
      throw new Exception('Please fill it out within 15 letters !');
    }
    if(!isset($_POST['email']) || $_POST['email'] === '' ) {
      throw new Exception('Please fill out your email address !');
    }
    if(!filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)){
      throw new Exception('Please confirm your email address !');
    }
    if(!isset($_POST['phone']) || $_POST['phone'] === '' ) {
      throw new Exception('Please fill out your phone number !');
    }
    if(!preg_match("/^[0-9０-９]+$/", $_POST['phone'])){
      throw new Exception('You can use only number * No blank!');
    }
    if(!isset($_POST['content']) || $_POST['content'] === '' ) {
      throw new Exception('Please fill out content !');
    }
    if(mb_strlen($_POST['content'], 'utf-8') > 300){
      throw new Exception('Please fill it out within 300 letters !');
    }
  }

  public function upload () {
    try {
        // validate
        $this->_validateToken();
        $this->_validatePost();
        // insert
        $sql = 'insert into users (name,email,phone_number,content) values (:name,:email,:phone,:content)';
        $statement = $this->_db-> prepare($sql);
        $statement-> bindParam(':name', $_POST['name']);
        $statement-> bindParam(':email', $_POST['email']);
        $statement-> bindParam(':phone', $_POST['phone']);
        $statement-> bindParam(':content', $_POST['content']);
        $statement-> execute();
      } catch (Exception $e) {
        // set error
        $_SESSION['error'] = $e->getMessage();
      }
    // redirect
    header('Location: http://'. $_SERVER['HTTP_HOST'].'/public/contact.php');
    // さくらレンタルサーバー書き換え header('Location: https://'. $_SERVER['HTTP_HOST'].'/public/contact.php');
    exit;
  }

  public function getError () {
    $errors = null;
    if(isset($_SESSION['error'])) {
      $errors = $_SESSION['error'];
      unset($_SESSION['error']);
    }
    return $errors;
  }

  public function showAll () {
    $sql = 'select * from users order by id desc';
    $statement = $this->_db-> query($sql);
    return $statement-> fetchAll(PDO::FETCH_OBJ);
  }

}
