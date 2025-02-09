export async function getProjects() {

    let projects = [  
    ];

     for(let i=0;i < 20;i++){

        projects.push({
            title: "Project "+i,
            id: "projectid"+i,
            imgurl: ""
        });
     }


    return projects;
}