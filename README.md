## Setup
You will need node.js installed and configured in your preferred terminal. Confirm you have everything by running by making sure the following returns version numbers:

```
node -v
npm -v
```

Run `npm i` to install packages.

1. Using HaRepacker, get Skill.wz and export selection 'Skill.wz' as XML > Classic into this folder.
2. Using HaRepacker, open String.wz and export selection 'Skill.img' (not String.wz) as XML > Classic. 

You can also use WzComparerR2:

1. Run https://github.com/PirateIzzy/WzComparerR2/blob/master/WzComparerR2.LuaConsole/Examples/DumpXml.lua, changing `topNode` and `outputDir` as required.
2. Copy `String.img.xml` into `mswiki-skills`
3. Copy the `Skill` folder into `mswiki-skills` and rename to `Skill.wz`

Your file structure should be:
```
> mswiki-skills
    - README.md
    - Skill.img.xml
    > Skill.wz
        - 000.img.xml
        - 100.img.xml
        ...
        - Recipe_9204.img.xml
```

Run `npm start`!

There are three steps that will run. The second step is the slowest, as it's pairing up strings with skills. The output is a file called `all.json`.

If something goes wrong, you can perform a particular step using `npm start 1` (or 2 or 3).


## Recommendations
Delete the generated `tempbig`, `tempxml` and `finalxml` folders. They're not necessary once you have your `all.json`. Delete them (or change them in the code) if you are running Skill001 and Skill002 - unless you want to generate an all.json with all skills data.

## Viewing wiki skills
Open `index.html` in a browser and load the outputted `all.json`.

## Making changes
This is to make changes to transformations.

After changing any xslt, you need to convert it into SEF:
```bash
node_modules\.bin\xslt3 -xsl:transforms/skill-big-to-small.xslt -export:transforms/skill-big-to-small.sef.json -t -nogo
node_modules\.bin\xslt3 -xsl:transforms/skill-mixed-to-final.xslt -export:transforms/skill-mixed-to-final.sef.json -t -nogo
```
