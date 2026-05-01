import TitlePanelMobile from './TitlePanelMobile'
import CredentialsPanelMobile from './CredentialsPanelMobile'
import ProjectsPanelMobile from './ProjectsPanelMobile'
import FeaturedPanelMobile from './FeaturedPanelMobile'
import AchievementsPanelMobile from './AchievementsPanelMobile'
import ContactPanelMobile from './ContactPanelMobile'

export default function PanelRouter({ slide, active, gyroEnabled, onEnableGyro }) {
  const props = { slide, active }
  switch (slide.kind) {
    case 'title':        return <TitlePanelMobile {...props} />
    case 'credentials':  return <CredentialsPanelMobile {...props} gyroEnabled={gyroEnabled} onEnableGyro={onEnableGyro} />
    case 'projects':     return <ProjectsPanelMobile {...props} />
    case 'featured':     return <FeaturedPanelMobile {...props} />
    case 'achievements': return <AchievementsPanelMobile {...props} />
    case 'contact':      return <ContactPanelMobile {...props} />
    default:             return null
  }
}
