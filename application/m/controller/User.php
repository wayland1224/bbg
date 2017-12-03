<?php
/**
 * Created by PhpStorm.
 * User: trrtly
 * Date: 17-12-3
 * Time: 上午11:38
 */
namespace app\m\controller;
use app\m\model\UserModel;
use think\Controller;

class User extends Controller
{
    public function center()
    {
        return $this->fetch();
    }

    public function showInformation()
    {
        return $this->fetch();
    }

    public function comment()
    {
        return $this->fetch();
    }
}