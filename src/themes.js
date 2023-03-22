import Cookies from 'universal-cookie';

const cookies = new Cookies();


//theme is number "xxx" where: 
//component: 1xx, color: x1x, light theme: xx1
//page: 0, navbar: 1, button: 2, poll:3, progress: 4, vote buttons: 5, input fields:6
//black: 0, white: 1, blue: 2, red: 3, green: 4
//dark: 0, light: 1
//No white light or dark black 


const colorStorage={
    11:"mainWhite",
    20:"mainBlue",
    21:"mainBlueL",
    30:"mainRed",
    111:"barWhite",
    120:"barBlue",
    121:"barBlueL",
    130:"barRed",
    140:"barGreen",
    211:"btnWhite",
    220:"btnBlue",
    221:"btnBlueL",
    230:"btnRed",
    311:"pollWhite",
    320:"pollBlue",
    321:"pollBlueL",
    330:"pollRed",
    420:"progressBlue",
    421:"progressBlueL",
    520:"voteButBlue",
    521:"voteButBlueL",
    620:"inputBlue",
    621:"inputBlueL",
}

function GetThemeList(){
    const elementsNum=6
    let l=[],col,light
    col=parseInt(cookies.get("themeColor"))
    light=parseInt(cookies.get("themeLight"))

    if(isNaN(col)||isNaN(light)){
        for(let i=0; i<elementsNum+1; i++){
            l.push(colorStorage[i*100+2*10+1])
        }
    }
    else{
        for(let i=0; i<elementsNum+1; i++){
            l.push(colorStorage[i*100+col*10+light])
        }
    }
    
    return l
}

const themes={GetThemeList}
export default themes