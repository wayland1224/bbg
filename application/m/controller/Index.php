<?php
namespace app\m\controller;
use app\m\model\UserModel;
use think\Controller;

class Index extends Controller
{
    public function index()
    {
//        $userList = UserModel::all();
//        foreach ($userList as $user) {
//            $info = $user->toArray();dump($info);exit;
//        }
        return $this->fetch();
    }
}
