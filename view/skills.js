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
        {{#skills}}
            <h2 class="title is-5">
                {{id}}: {{strings.name}}
                <a href="https://maplestory.fandom.com/wiki/{{strings.name}}" target="_blank">
                    <button class="button is-link is-light is-small">Wiki page</button>
                </a>
            </h2>
            <div class="columns">
                <div class="column is-3">
                    <h2 class="title is-5">Attributes</h5>
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
                <div class="column is-3">
                    <h2 class="title is-5">Info</h5>
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
                <div class="column">
                    <textarea class="textarea is-small" onclick="this.select()" rows="14">{{wikitable}}</textarea>
                </div>
            </div>
            
        {{/skills}}
    `;

    let skillData;

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
                    renderContent(anchor.getAttribute('data-groupid'));
                };
            }
        }
    };

    const renderContent = (group) => {
        const main = document.getElementById('main');

        let data = [];
        for (const skill of gen.getSkillsForGroup(skillData, group)) {
            const skillDetails = gen.getAll(skill);
            skillDetails.infoTable = Object.entries(skillDetails.info);
            skillDetails.attrTable = Object.entries(skillDetails.attributes);
            data.push(skillDetails);
        }
        main.innerHTML = Mustache.render(tp.main, {
            skills: data
        });
    };

    skillFileUpload.onchange = function(event) {
        var file = skillFileUpload.files[0];
        //TODO do something with fileList.
        var fr = new FileReader();
        fr.readAsText(file);
        fr.onload = () => {
            console.log(JSON.parse(fr.result));
            skillData = JSON.parse(fr.result);
            renderSidebar(skillData);
        };
    }

    

}(window.Mustache, window.gen));