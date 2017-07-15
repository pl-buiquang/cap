import React from 'react';
import config from '../../../utils/config.js';
import {analytics} from '../../../services/requests';

const STYLE_HEADER = {
  display: 'flex',
  backgroundColor: '#fff',
}

const STYLE_CONTAINER = {
  padding: '10px',
}

const STYLE_BACK = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fff',
  padding: '10px',
  cursor: 'pointer',
}

const STYLE_IMAGE = {
  marginTop: '10px',
  height: '240px',
  width: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: 'cover',
};


const STYLE_IMAGE_DEFAULT = {

}

const STYLE_CONTENT = {
  backgroundColor: '#fff',
}

const processRS = (rs) => {
  const configData = config();
  rs = rs.replace("<br>", " <br>");
  rs = rs.replace("<br/>", " <br/>");
  const regex = /(\S+.*:\s*)?(http|https):\/\/(\S+)/g;
  const matches = [];
  let match = [];
  while ((match = regex.exec(rs)) !== null) {
    matches.push(match);
  }
  let links = [];
  if (matches) {
    links = matches.filter(m => m).map((m,i) => {
      let img = <img src={configData.baseURI+'img/misc/web-48.png'} />;
      if((m[3] && m[3].search(/(F|f)acebook/) !== -1) || (m[1] && m[1].search(/(F|f)acebook/) !== -1)){
        img = <img src={configData.baseURI+'img/misc/facebook-48.png'} />;
      }
      if((m[3] && m[3].search(/(T|t)witter/) !== -1) || (m[1] && m[1].search(/(T|t)witter/) !== -1)){
        img = <img src={configData.baseURI+'img/misc/twitter-48.png'} />;
      }
      if((m[3] && m[3].search(/(i|I)nstagram/) !== -1) || (m[1] && m[1].search(/(i|I)nstagram/) !== -1)){
        img = <img src={configData.baseURI+'img/misc/Instagram-Color.png'} />;
      }
      if((m[3] && m[3].search(/(Y|y)outube/) !== -1) || (m[1] && m[1].search(/(Y|y)outube/) !== -1)){
        img = <img src={configData.baseURI+'img/misc/YouTubeButton.png'} />;
      }
      return <a key={i} style={{marginRight: '20px'}} href={`${m[2]}://${m[3]}`} target="_blank">{img}</a>;      
    })
  }
  return <div>{links}</div>;
}

const processWebsite = (website) => {
  const regex = /\s*(lien\s*:|(.*)\s+:)?\s*(\S+)/;
  const match = regex.exec(website);
  if (match) {
    const re2 = /([\S]*)(\s+(;|\/)(.*))?/;
    const url = re2.exec(match[3]);
    if (!url[1].startsWith("http://") && !url[1].startsWith("http://")) {
      url[1] = "http://"+url[1];
    }
    if (url[4]) {
      url[4] == url[4].trim();
      if (!url[4].startsWith("http://") && !url[4].startsWith("http://")) {
        url[4] = "http://"+url[4];
      }
      return (
        <span>
          <a href={url[1]} target="_blank">{url[1]}</a><br />
          <a href={url[4]} target="_blank">{url[4]}</a><br />
        </span>
      );
    }
    return (
      <span>
        <a href={url[1]} target="_blank">{url[1]}</a><br />
      </span>
    );
  }
  return website;
}

class FullView extends React.Component {
  static propTypes = {
    actor: React.PropTypes.object,
    map: React.PropTypes.node,
    close: React.PropTypes.func
  }

  state = {
    showMail: false,
  }

  componentWillReceiveProps (newProps, oldProps){
    this.setState({
      showMail: false
    });
  }

  showMail = () => {
    const {showMail} = this.state;
    const {actor} = this.props;
    if (!showMail) {
      analytics({alt: actor.id, mail: true});
      this.setState({
        showMail: true
      });
    }
  }


  render() {
    const {actor, map} = this.props;
    const {showMail} = this.state;
    const configData = config();
    const typology = configData["typology"];
    const typoInfo = typology.find(t => t.id === actor.id_typologie);
    const typoColor = typoInfo ? typoInfo["color"] : '#fff';
    return (
      <div>
        <div style={{...STYLE_BACK, backgroundColor: typoInfo["color"]}} onClick={this.props.close}>
          Retour à la carte
        </div>
        <div style={{...STYLE_CONTAINER, backgroundColor: '#fff'}}>
          <div style={{...STYLE_HEADER}}>
            <div style={{width: '60%'}}>
              <div style={{fontFamily: 'Bebas Neue', fontSize: '36px', display: 'flex', justifyContent: 'center'}}><div>{actor.name}</div></div>
              <div style={{fontSize: '24px', fontStyle: 'italic', display: 'flex', justifyContent: 'center'}}><div>{actor.orga_initiative}</div></div>
              <div className="alt-list-view-image" style={{...STYLE_IMAGE, backgroundImage: `url(${configData.baseURI+actor.presa_image})`}} />
              {actor.credit_picto && <div style={{fontSize: '14px'}}>{`Crédit photo : ${actor.credit_picto}`}</div>}
              {actor.lieu_initiative && <div style={{fontSize: '18px', marginTop: '10px',}}>{actor.lieu_initiative}</div>}
              {actor.contact_initiative && <div style={{fontSize: '18px', marginTop: '10px'}}><b>Contact :</b> {actor.contact_initiative}</div>}
              {actor.horaires_initiative && <div style={{fontSize: '18px', marginTop: '10px'}}><b>Horaires :</b>{` ${actor.horaires_initiative}`}</div>}
            </div>
            <div style={{width: '40%', paddingLeft: '10px'}}>
              {map}
              <div style={{fontSize: '16px', marginTop: '10px', display: 'flex', alignItems: 'center'}}>
                <i className="fa fa-map-marker" aria-hidden="true" style={{marginRight: '10px', fontSize: '20px'}}></i>
                <a target="_blank" href={`https://maps.google.com/?q=${actor.lat_initiative},${actor.long_initiative}&t=m`}>{actor.adress}</a>
              </div>
              {actor.website_initiative && 
                <div style={{fontSize: '16px', marginTop: '10px', display: 'flex', alignItems: 'center'}}>
                  <i className="fa fa-external-link" aria-hidden="true" style={{marginRight: '10px'}}></i> 
                  {processWebsite(actor.website_initiative)}
                </div>
              }
              <div style={{fontSize: '16px'}} onClick={this.showMail}>
                {showMail ?
                  (<div>
                    {actor.email_initiative &&
                      <div style={{fontSize: '16px', marginTop: '10px', display: 'flex', alignItems: 'center'}}>
                        <i className="fa fa-envelope" aria-hidden="true" style={{marginRight: '10px', fontSize: '20px'}}></i>
                        <a href={`mailto:${actor.email_initiative}`}>{actor.email_initiative}</a>
                      </div>
                    }
                    {actor.tel_initiative && 
                      <div style={{fontSize: '16px', marginTop: '10px', display: 'flex', alignItems: 'center'}}>
                        <i className="fa fa-phone" aria-hidden="true" style={{marginRight: '10px', fontSize: '20px'}}></i>
                        {actor.tel_initiative}
                      </div>
                    }
                  </div>) :
                  (<div style={{display: 'flex', marginTop: '10px', alignItems: 'center'}}>
                    <i className="fa fa-address-card" aria-hidden="true" style={{marginRight: '10px'}}></i>
                    <span style={{cursor: 'pointer'}}>Afficher les informations de contact</span>
                  </div>)
                }
              </div>
              <div style={{fontSize: '16px', marginTop: '10px'}}>{processRS(actor.rs_initiative)}</div>
            </div>
          </div>
          <div style={STYLE_CONTENT}>
            <div style={{fontSize: '20px'}} dangerouslySetInnerHTML={{__html: actor.objet_initiative}} />
            <div style={{fontSize: '20px'}} dangerouslySetInnerHTML={{__html: actor.info_initiative}} />
          </div>
        </div>
      </div>
    );
  }
}

export default FullView;