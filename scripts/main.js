const reposFilterBtns = document.querySelectorAll('.find-repos button.filter');
function routeBtnClickToSummaryElement (e) {
  e.preventDefault();
  this.parentElement.click();
}
reposFilterBtns.forEach(reposfilterBtn => {
  reposfilterBtn.addEventListener('click', routeBtnClickToSummaryElement);
});

const getDateStrings = (repoDate, base = new Date()) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [year, month, day, ...timeArr] = repoDate.slice(0, -1).split(/[-T]/);
  const [hours, minutes, seconds] = timeArr[0].split(':');
  if (base.getFullYear() === Number(year)) {
      if (base.getMonth() + 1 === Number(month)) {
          if (base.getDate() === Number(day)) {
              if (base.getHours() === Number(hours)) {
                  if (base.getMinutes() === Number(minutes)) {
                    return `Updated ${base.getSeconds() - Number(seconds)} seconds ago`;
                  }
                  return `Updated ${base.getMinutes() - Number(minutes)} minutes ago`;
              }
              return `Updated ${base.getHours() - Number(hours)} hours ago`;
          }
          return `Updated ${base.getDate() - Number(day)} days ago`;
      }
      return `Updated on ${months[Number(month) - 1].slice(0, 3)} ${day}`;            
  }
  return `Updated on ${months[Number(month) - 1].slice(0, 3)} ${day}, ${year}`;
}

const getProfilePayloads = profileName => `
query {
  repositoryOwner(login: "snoseeds") {
    login,
    avatarUrl,
    ... on User {
      name,
      bio
    }
    repositories(affiliations: [OWNER], first: 20) {
      totalCount,
      nodes {
        name,
        ... on RepositoryInfo {
        	isPrivate,
          isFork,
          isArchived,
          isMirror,
          updatedAt
      	}
        isPrivate,
        description,
        stargazerCount,
        forkCount,
        updatedAt,
        languages(first: 20, orderBy: {
          field: SIZE,
          direction: DESC
        }) {
          nodes {
            name,
            color
          }
        }
      }
    }
  }
}`;

const options = {
  method: "post",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${atob("NmQ0ZDQ0NmUwNzg4MzIyOGRiNWY1OTljNWFjOGRkNjE1NDdlNmQ5Yw==")}`
  },
  body: JSON.stringify({
    query: getProfilePayloads("snoseeds")
  })
};
const repoPageContainter = document.querySelector('#repoPageContainter');
fetch(`https://api.github.com/graphql`, options)
  .then(res => res.json())
  .then(data => data.data)
  .then(({repositoryOwner}) => {
    console.log(repositoryOwner);
    repoPageContainter.insertAdjacentHTML('afterbegin', `
      <aside class="profile-summary">
          <div class="image-div">
              <img src=${repositoryOwner.avatarUrl} alt="${repositoryOwner.login}-avatar">
          </div>
          <p class="flex wrap user-full-name"><span>${repositoryOwner.name.split(/\/s+/)[0]}</span><span>${repositoryOwner.name.split(/\/s+/)[1]}</span></p>
          <p class="user-nickname text-grey">${repositoryOwner.login}</p>
          <p class="bio">${repositoryOwner.bio}</p>
      </aside>
      <main class="account-details">
        <nav class="page-header sub-header flex flex-start">
          <a class="page-title flex space-between">
            <svg class="icon" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                <path fill-rule="evenodd" d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z">
                </path>
            </svg>
            <h3 class="title">Overview</h3>
            <span class="count"></span>
          </a>
          <a href="repositories" class="repositories page-title flex space-between active">
              <svg class="icon octicon octicon-repo UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z">
                  </path>
              </svg>
              <h3 class="title">Repositories</h3>
              <span class="count">${repositoryOwner.repositories.totalCount}</span>
          </a>
          <a class="page-title flex space-between">
              <svg class="icon octicon octicon-project UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M1.75 0A1.75 1.75 0 000 1.75v12.5C0 15.216.784 16 1.75 16h12.5A1.75 1.75 0 0016 14.25V1.75A1.75 1.75 0 0014.25 0H1.75zM1.5 1.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v12.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25V1.75zM11.75 3a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75zm-8.25.75a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5zM8 3a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 008 3z">
                  </path>
              </svg>
              <h3 class="title">Projects</h3>
              <span class="count"></span>
          </a>
          <a class="page-title flex space-between">
              <svg class="icon octicon octicon-package UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z">
                  </path>
              </svg>
              <h3 class="title">Packages</h3>
              <p class="count"></p>
          </a>
        </nav>
        <div class="repos-section flex space-between">
            <form action="" class="find-repos flex">
                <input placeholder="Find a repository..." type="text" class="find-repo">
                <details class="repos-type repos-find-btn">
                    <summary class="filter flex">
                        <button class="filter btn flex cent-content-vertically">
                            <i data-select-type="Type" class="select-type">Type</i><span data-selected-option="All" class="show-selected">: All</span>
                            <div class="svg-div">
                                <svg class="icon-arrow" width="8" height="7" viewBox="-0.019531 -52.792969 30.039062 25.195312">
                                    <path
                                      d="M29.941406 -52.500000C29.785156 -52.656250 29.589844 -52.753906 29.355469 -52.792969L0.644531 -52.792969C0.410156 -52.753906 0.214844 -52.656250 0.058594 -52.500000C-0.019531 -52.265625 0.000000 -52.050781 0.117188 -51.855469L14.472656 -27.890625C14.628906 -27.734375 14.804688 -27.636719 15.000000 -27.597656C15.234375 -27.636719 15.410156 -27.734375 15.527344 -27.890625L29.882812 -51.855469C30.000000 -52.089844 30.019531 -52.304688 29.941406 -52.500000ZM29.941406 -52.500000"
                                      fill="black">
                                    </path>
                                </svg>
                            </div>
                        </button>
                    </summary>
                    <div class="select-options">
                        <header class="options-list flex space-between">
                            <h3>Select <span class="select-type">type</span></h3>
                            <svg aria-label="Close menu" class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                        </header>
                        <div class="SelectMenu-list">
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon cent-content-vertically">
                                <svg class="octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_" value="" hidden="hidden" checked="checked">
                              <span class="text-normal" data-menu-button-text="">All</span>
                            </label>
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="true" tabindex="0">
                              <div class="select-menu-icon">
                                <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_public" value="public" hidden="hidden">
                              <span class="text-normal" data-menu-button-text="">Public</span>
                            </label>
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon">
                                <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_private" value="private" hidden="hidden">
                              <span class="text-normal" data-menu-button-text="">Private</span>
                            </label>
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon">
                                <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_source" value="source" hidden="hidden">
                              <span class="text-normal" data-menu-button-text="">Sources</span>
                            </label>
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon">
                                <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_fork" value="fork" hidden="hidden" data-autosubmit="true">
                              <span class="text-normal" data-menu-button-text="">Forks</span>
                            </label>
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon cent-content-vertically">
                                <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_archived" value="archived" hidden="hidden">
                              <span class="text-normal" data-menu-button-text="">Archived</span>
                            </label>
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon">
                                <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="type_mirror" value="mirror" hidden="hidden">
                              <span class="text-normal" data-menu-button-text="">Mirrors</span>
                            </label>
                        </div>
                    </div>
                </details>
                <details class="language-type repos-find-btn">
                    <summary class="filter flex">
                        <button class="filter btn flex cent-content-vertically">
                            <i data-select-type="Type" class="select-type">Language</i><span data-selected-option="All" class="show-selected">: All</span>
                            <div class="svg-div">
                                <svg class="icon-arrow" width="8" height="7" viewBox="-0.019531 -52.792969 30.039062 25.195312">
                                    <path
                                      d="M29.941406 -52.500000C29.785156 -52.656250 29.589844 -52.753906 29.355469 -52.792969L0.644531 -52.792969C0.410156 -52.753906 0.214844 -52.656250 0.058594 -52.500000C-0.019531 -52.265625 0.000000 -52.050781 0.117188 -51.855469L14.472656 -27.890625C14.628906 -27.734375 14.804688 -27.636719 15.000000 -27.597656C15.234375 -27.636719 15.410156 -27.734375 15.527344 -27.890625L29.882812 -51.855469C30.000000 -52.089844 30.019531 -52.304688 29.941406 -52.500000ZM29.941406 -52.500000"
                                      fill="black">
                                    </path>
                                </svg>
                            </div>
                        </button>
                    </summary>
                    <div class="select-options">
                        <header class="options-list flex space-between">
                            <h3>Select <span class="select-languaage">language</span></h3>
                            <svg aria-label="Close menu" class="octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
                        </header>
                        <div class="SelectMenu-list">
                            <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                              <div class="select-menu-icon cent-content-vertically">
                                <svg class="octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                              </div>
                              <input type="radio" name="type" id="language_" value="" hidden="hidden" checked="checked">
                              <span class="text-normal" data-menu-button-text="">All</span>
                            </label>
                            ${Array.from(repositoryOwner.repositories.nodes.reduce((uniqLanguages, {languages}) => {
                              languages.nodes.forEach(language => uniqLanguages.add(language));
                              return uniqLanguages;
                            }, new Set())).map(uniqLanguage => {
                              return `
                                <label class="selectMenu-item flex" role="menuitemradio" aria-checked="false" tabindex="0">
                                  <div class="select-menu-icon">
                                    <svg class="hide octicon octicon-check SelectMenu-icon SelectMenu-icon--check" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
                                  </div>
                                  <input type="radio" name="type" id=${uniqLanguage} value=${uniqLanguage} hidden="hidden">
                                  <span class="text-normal" data-menu-button-text="">${uniqLanguage}</span>
                                </label>
                              `
                            }).join('\n')}
                    </div>
                </details>
            </form>
            <a href="#" class="flex button cent-content-vertically">
                <div class="svg-div">
                    <svg class="icon octicon octicon-repo UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                        <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                        fill="white">
                        </path>
                    </svg>
                </div>
                <span class="new-repo">New</span>
            </a>
        </div>
        <div class="repos-list">
        ${repositoryOwner.repositories.nodes.map(repo => {
          return `
            <div class="repo-item flex space-between">
                <div class="repo-details">
                    <h3 class="repo-header">
                        <a href="" class="repo-name">${repo.name}</a>
                        ${repo.isPrivate ? `<span class="repo-label">Private</span>` : ''}
                    </h3>
                    ${repo.description ? `
                      <p class="text-grey repo-description">${repo.description}</p>
                    ` : ''}
                    <div class="flex repo-footer">
                    ${repo.languages.length >= 1 ? `
                      <p class="repo-language">
                        <span class="repo-language-color ${repo.languages[0].toLowerCase()}-color"></span>
                        <span class="repo-language-name text-grey">${repo.languages[0]}</span>
                      </p>
                    `: ''}
                        <a class="repo-link flex text-grey" href="https://www.github.com/snoseeds/${repo.name}/stargazers">
                            <svg aria-label="star" class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                            <p>1</p>
                        </a>
                        <a class="repo-link flex text-grey" href="/snoseeds/${repo.name}/network/members">
                            <svg class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                            <p>1</p>
                        </a>
                        <p class="last-updated text-grey">${getDateStrings(repo.updatedAt)}</p>
                    </div>
                </div>
                <div>
                    <button class="flex btn btn-sm star-btn cent-content-vertically">
                        <div class="svg-div">
                            <svg class="octicon octicon-star-fill mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path></svg>
                        </div>
                        <span class="text">Star</span>
                    </button>
                </div>
            </div>
          
          `

        })}
        </div>
</main>
    `)
  })
  .catch(err => console.log(err));