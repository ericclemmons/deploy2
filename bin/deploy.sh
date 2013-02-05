#!/bin/bash

REPO=$1
BRANCH=$2
COMMIT=$3
TMP="${TMPDIR}./deploy2/${REPO}"

if [ ! -d "${TMP}/.git" ] ; then
    mkdir -p $TMP
    git clone --depth=100 --branch=$BRANCH "git@github.com:${REPO}.git" $TMP
fi

cd $TMP

git fetch origin
git checkout -qf $COMMIT

cap staging deploy --set branch=$BRANCH
