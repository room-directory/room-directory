import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class FacultyInformationPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.FACULTY_INFORMATION}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  /** Fills out and submits the form to signin, then checks to see that login was successful. */
  async sortBy(category) {
    const visible = await Selector(`#${COMPONENT_IDS.FACULTY_INFORMATION_SORT}`).visible;
    if (!visible) {
      await t.click('button.faculty-information-sort-toggler');
    }
    await t.click(`#${COMPONENT_IDS.FACULTY_INFORMATION_SORT}`);
    await t.click(`#${COMPONENT_IDS.FACULTY_INFORMATION_SORT}${category}`);
    await t.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const facultyInformationPage = new FacultyInformationPage();
