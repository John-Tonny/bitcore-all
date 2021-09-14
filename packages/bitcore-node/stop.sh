#!/bin/bash

USER_PATH=~
MODULE_PATH=$USER_PATH/bitcore/packages
NODE_PATH=$USER_PATH/.nvm/versions/node/v10.5.0/bin

cd $MODULE_PATH/bitcore-node

stop_program ()
{
  pidfile=$1

  echo "Stopping Process - $pidfile. PID=$(cat $pidfile)"
  kill -9 $(cat $pidfile)
  rm -f $pidfile
  
}

stop_program bitcore-node.pid

