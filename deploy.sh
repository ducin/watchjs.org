#!/bin/bash

echo 'deployment started'

grunt
cp CNAME dist/CNAME
# entire 'dist' content is ready to be deployed
git branch -D gh-pages
git checkout -b gh-pages
# gh-pages branch has been dropped and synced with current master
ls | grep -v -e 'dist' -e 'node_modules' | xargs rm -rf
git rm $(git ls-files --deleted)
mv dist/* .
git add .
git commit --amend --no-edit
# push with force and go back to master
git push -f
git checkout master

echo 'deployment finished'

