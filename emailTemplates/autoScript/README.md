# Email Template

## Install
1. run `yarn install`

## Write email template

1. Create a html file with the email template name in ./input folder
2. run `yarn start`
3. In browser, input `localhost:3001/[YOUR_HTML_FILE]`
Now you can see your email template.
You can write style class in ./style.css

## Generate email template
1. run `yarn generate`
All email templates in ./input folder will generate email templates with style inline in ./ouput folder

## Export email template
1. run `yarn export`
All email temapltes in ./output folder will export email templates for live and staging in ../live and ../staging folder.

## Notes
Becasue sometimes we will have some different settings, like the home page url.
Then we can set this in export.js file