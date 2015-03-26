#!/bin/bash

echo 'deployment started'

grunt
cp CNAME dist/CNAME
# entire 'dist' content is ready to be deployed
git branch -D gh-pages
git checkout -b gh-pages
ls | grep -v '[dist|node_modules]' | xargs rm -rf
git rm $(git ls-files --deleted)
mv dist/* .
git add .
git commit --amend --no-edit
git push -f
git checkout master

echo 'deployment finished'

