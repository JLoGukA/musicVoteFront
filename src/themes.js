
//theme is number "xxx" where: 
//component: 1xx, color: x1x, light theme: xx1
//page: 0, navbar: 1, button: 2, poll:3, progress: 4, vote buttons: 5
//black: 0, white: 1, blue: 2, red: 3, green: 4
//dark: 0, light: 1
//No white light or dark black 
import Cookies from 'universal-cookie';
const cookies = new Cookies();

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
    
}

function getThemeList(props){
    
    let l=[],col,light

    if(isNaN(col=parseInt(cookies.get("themeColor")))||isNaN(light=parseInt(cookies.get("themeLight")))){
        for(var i=0; i<props; i++){
            l.push(colorStorage[i*100+2*10+0])
        }
    }
    else{
        for(var i=0; i<props; i++){
            l.push(colorStorage[i*100+col*10+light])
        }
    }
    
    return l
}

const themes={getThemeList}
export default themes