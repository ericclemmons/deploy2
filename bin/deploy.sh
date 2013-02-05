#!/bin/bash

# Help screen
if [ -z "$1" -o -z "$2" -o -z "$3" ] ; then
    echo "Usage: deploy.sh Username/Repo master COMMITTISH"
    exit 1
fi

# Force develop/master
if [ ! \( "develop" = "$2" -o "master" = "$2" \) ] ; then
    echo "$2 is not a deployable branch."
    exit 1
fi

# Setup repository for deployment
setup ()
{
    local TMP="${TMPDIR}/tmp/deploy2/$1"

    if [ ! -d "${TMP}/.git" ] ; then
        mkdir -p $TMP
        git clone --depth=100 --branch=$2 "git@github.com:$1.git" $TMP
    fi

    cd $TMP

    git fetch origin
    git checkout -qf $3
}

# Custom deployment script
deploy ()
{
    cap staging deploy --set branch=$2
}

setup $@ && deploy $@

exit $?