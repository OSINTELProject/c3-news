#!/bin/bash
function is_int() { return $(test "$@" -eq "$@" > /dev/null 2>&1); }
ssh-add -D
git init
git config --global --unset user.name
git config --global --unset user.email
git config user.name "OSINTELProject"
git config user.email "osintelproject@outlook.com"
ssh-add -k /Users/morpheous/Documents/Misc/SSH2/KEYS/osintel-project

LastCommit=$(git log -1 --pretty="%B" | xargs)
# https://stackoverflow.com/a/3626205
if $(is_int "${LastCommit}");
    then
    NextCommitNumber=$((LastCommit+1))
else
   echo "Not an integer Resetting"
   NextCommitNumber=1
fi
git add .
git commit -m "$NextCommitNumber"
git remote add origin git@github.com:OSINTELProject/c3-news.git
git push origin master