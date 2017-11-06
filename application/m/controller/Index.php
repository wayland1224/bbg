<?php
namespace app\m\controller;
use app\common\model\User;
use think\Controller;

class Index extends Controller
{
    public function index()
    {
        $userList = User::all();
        dump($userList);exit;
        return $this->fetch();
    }
}
