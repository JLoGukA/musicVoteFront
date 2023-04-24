import Cookies from 'universal-cookie';

const cookies = new Cookies();


//theme is number "xxx" where: 
//component: 1xx, color: x1x, light theme: xx1

//page: 0, navbar: 1, button: 2, poll:3, progress: 4, vote buttons: 5, input fields:6, text:7, table:8
//black: 0, white: 1, blue: 2, red: 3, green: 4
//dark: 0, light: 1
//No dark black 
//page color is set via: document.body.style.background, others are classNames

//background: linear-gradient(0.6turn, #3f87a6, #ebf8e1, #f69d3c);
//background: linear-gradient(0.6turn, #3f87a6, #ebf8e1);
const colorStorage={
    11:"mainWhite",
    20:"#0b212f",
    21:"linear-gradient(230deg, #a2c1ff, #ffffff) no-repeat",
    30:"#ffdfb6",
    31:"linear-gradient(230deg, #ffa2a2, #ffffff) no-repeat",
    40:"linear-gradient(230deg, #ffa2a2, #ffffff) no-repeat",
    41:"linear-gradient(230deg, #aaffa2, #ffffff) no-repeat",
    111:"barWhite",
    120:"barBlue",
    121:"barBlueL",
    130:"barRed",
    131:"barRedL",
    140:"barGreen",
    141:"barGreenL",
    211:"btnWhite",
    220:"btnBlue",
    221:"btnBlueL",
    230:"btnRed",
    231:"btnRedL",
    240:"btnGreen",
    241:"btnGreenL",
    311:"pollWhite",
    320:"pollBlue",
    321:"pollBlueL",
    330:"pollRed",
    331:"pollRedL",
    340:"pollGreen",
    341:"pollGreenL",
    420:"progressBlue",
    421:"progressBlueL",
    430:"progressRed",
    431:"progressRedL",
    440:"progressGreen",
    441:"progressGreenL",
    520:"voteButBlue",
    521:"voteButBlueL",
    530:"voteButRed",
    531:"voteButRedL",
    540:"voteButGreen",
    541:"voteButGreenL",
    620:"inputBlue",
    621:"inputBlueL",
    630:"inputRed",
    631:"inputRedL",
    640:"inputGreen",
    641:"inputGreenL",
    720:"textBlue",
    721:"textBlueL",
    730:"textRed",
    731:"textRedL",
    740:"textGreen",
    741:"textGreenL",
    820:"tableBlue",
    821:"tableBlueL",
    830:"tableRed",
    831:"tableRedL",
    840:"tableGreen",
    841:"tableGreenL",
}

function GetThemeList(){
    const elementsNum=8
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