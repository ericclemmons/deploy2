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
        echo "Creating ${TMP}..."
        mkdir -p $TMP

        echo "Cloning git@github.com:$1.git@$2"
        git clone --depth=100 --branch=$2 "git@github.com:$1.git" $TMP
    fi

    echo "Switching to $TMP..."
    cd $TMP

    echo "Fetching origin..."
    git fetch origin

    echo "Checking out $3..."
    git checkout -qf $3

    return $?
}

# Custom deployment script
deploy ()
{
    case "$2" in
        "develop") stage="staging" ;;
        "master") stage="production" ;;
    esac

    echo cap $stage deploy --set branch=$2

    return $?
}

setup $@ && deploy $@

exit $?
