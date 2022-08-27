/*setting listener to logout btn*/
try{
    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn.addEventListener("click", () => {
        const url = "/logout";

        const data  = {
            logout: true
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        fetch(url, options).then((res) => res.json()).then((data) => location.href = data.redirect_path);
    })
}catch{

}