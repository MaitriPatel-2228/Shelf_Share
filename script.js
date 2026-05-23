
function changeBook(num){
    const images = [
        "hp1.jpg",
        "hp2.jpg",
        "hp3.jpg",
        "hp4.jpg",
        "hp5.jpg",
        "hp6.jpg",
        "hp7.jpg"
    ];

    document.getElementById("bookImage").src = images[num - 1];
}
