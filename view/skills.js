;(function(Mustache, gen) {
    const skillFileUpload = document.getElementById('skill-file-upload');

    const tp = {};

    tp.sidebar = `
        <aside class="menu">
            <p class="menu-label">
                Skill groups
            </p>
            <ul class="menu-list">
            {{#skills}}
            <li><a class="group-item" data-groupid="{{.}}">{{.}}</a></li>
            {{/skills}}
            </ul>
        </aside>`;

    tp.main = `
        {{#hasErrors}}
        <article class="message is-danger">
            <div class="message-body">
                <ul>
                    {{#errors}}
                    <li>{{.}}</li>
                    {{/errors}}
                </ul>
            </div>
        </article>
        {{/hasErrors}}
        {{#skills}}
            <h2 class="title is-5" id="{{id}}">
                {{id}}: {{strings.name}}
                <a href="https://maplestory.fandom.com/wiki/{{strings.name}}" target="_blank">
                    <button class="button is-link is-light is-small">Wiki page</button>
                </a>
            </h2>
            <div class="columns">
                <div class="column is-6">
                    <div class="columns is-full">
                        <div class="column is-6">
                            <h2 class="title is-6">Attributes</h5>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Attr</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{#attrTable}}
                                        <tr>
                                            <td>{{0}}</td><td>{{1}}</td>
                                        </tr>
                                    {{/attrTable}}
                                </tbody>
                            </table>
                        </div>
                        <div class="column is-6">
                            <h2 class="title is-6">Info</h5>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Info</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {{#infoTable}}
                                        <tr>
                                            <td>{{0}}</td><td>{{1}}</td>
                                        </tr>
                                    {{/infoTable}}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>String</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{#strTable}}
                                <tr>
                                    <td>{{0}}</td><td>{{1}}</td>
                                </tr>
                            {{/strTable}}
                        </tbody>
                    </table>
                </div>
                <div class="column">
                    <textarea class="textarea is-small" onclick="this.select()" rows="14">{{wikitable}}</textarea>
                </div>
            </div>
        {{/skills}}
    `;

    let skillData;
    let injectedSkillName = '';
    let currentGroup = null;
    let injectedPrependText = '<tabber>\n|-|GMS v233=';

    const renderSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = Mustache.render(tp.sidebar, {
            skills: gen.getSkillGroups(skillData)
        });
        var anchors = document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
            let anchor = anchors[i];
            if ((/\bgroup-item\b/g).test(anchor.className)) {
                anchor.onclick = function() {
                    currentGroup = anchor.getAttribute('data-groupid'); 
                    renderContent(currentGroup);
                };
            }
        }

        // injectedSkillName on click button
        let injectSkillButton = document.getElementById('injectSkillName');
        injectSkillButton.onclick = function() {
            injectedSkillName = document.getElementById('injectedSkillName').value;
            renderContent(currentGroup);
        };

        // injectedPrependText on click button
        let injectPrependTextButton = document.getElementById('injectPrependText');
        injectPrependTextButton.onclick = function() {
            injectedPrependText = document.getElementById('injectedPrependText').value;
            renderContent(currentGroup);
        };
    };

    const renderContent = (group) => {
        if (!group) return;
        const main = document.getElementById('main');

        let data = [];
        let errors = [];
        let skillsInGroup = gen.getSkillsForGroup(skillData, group);
        if (!skillsInGroup) {
            main.innerHTML = Mustache.render(tp.main, {
                skills: [],
                errors: ['Could not load any skills.'],
                hasErrors: true
            });
        }
        for (const skill of skillsInGroup) {
            try {
                const skillDetails = gen.getAll(skill, injectedSkillName);
                skillDetails.infoTable = Object.entries(skillDetails.info);
                skillDetails.attrTable = Object.entries(skillDetails.attributes);
                skillDetails.strTable = Object.entries(skillDetails.parsedStrings || {});
                if (injectedPrependText) {
                    let tempTable = skillDetails.wikitable.split('\n');
                    tempTable.splice(1, 0, injectedPrependText.replace(/^\n|\n$/g, ''));
                    skillDetails.wikitable = tempTable.join('\n');
                }
                data.push(skillDetails);
            }
            catch (e) {
                errors.push(`Could not load skill ${gen.getId(skill)}: ${e.toString()}`);
                console.error(e);
            }
        }
        main.innerHTML = Mustache.render(tp.main, {
            skills: data,
            errors,
            hasErrors: errors.length > 0
        });
    };

    skillFileUpload.onchange = function(event) {
        var file = skillFileUpload.files[0];
        //TODO do something with fileList.
        var fr = new FileReader();
        fr.readAsText(file);
        fr.onload = () => {
            skillData = JSON.parse(fr.result);
            renderSidebar(skillData);
        };
    }

    

}(window.Mustache, window.gen));