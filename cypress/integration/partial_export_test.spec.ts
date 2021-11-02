import PartialExportModal from "../support/pages/admin_console/configure/realm_settings/PartialExportModal";
import RealmSettings from "../support/pages/admin_console/configure/realm_settings/RealmSettings";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import AdminClient from "../support/util/AdminClient";
import { keycloakBefore } from "../support/util/keycloak_before";

describe("Partial realm export", () => {
  const REALM_NAME = "partial-export-test-realm";
  const client = new AdminClient();

  before(() => client.createRealm(REALM_NAME));
  after(() => client.deleteRealm(REALM_NAME));

  const loginPage = new LoginPage();
  const sidebarPage = new SidebarPage();
  const modal = new PartialExportModal();
  const realmSettings = new RealmSettings();

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToRealm(REALM_NAME);
    sidebarPage.goToRealmSettings();
    realmSettings.clickActionMenu();
    modal.open();
  });

  it("closes the dialog", () => {
    modal.cancelButton().click();
    modal.exportButton().should("not.exist");
  });

  it("shows a warning message", () => {
    modal.warningMessage().should("not.exist");

    modal.includeGroupsAndRolesSwitch().click({ force: true });
    modal.warningMessage().should("exist");
    modal.includeGroupsAndRolesSwitch().click({ force: true });
    modal.warningMessage().should("not.exist");

    modal.includeClientsSwitch().click({ force: true });
    modal.warningMessage().should("exist");
    modal.includeClientsSwitch().click({ force: true });
    modal.warningMessage().should("not.exist");
  });

  it("exports the realm", () => {
    modal.includeGroupsAndRolesSwitch().click({ force: true });
    modal.includeGroupsAndRolesSwitch().click({ force: true });
    modal.exportButton().click();
    cy.readFile(
      Cypress.config("downloadsFolder") + "/realm-export.json"
    ).should("exist");
    modal.exportButton().should("not.exist");
  });
});