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

class Pay extends Controller
{
    public function index()
    {
        return $this->fetch();
    }
}