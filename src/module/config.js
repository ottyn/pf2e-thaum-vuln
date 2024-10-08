import { exploitVuln } from "./feats/exploit-vulnerability/exploitVulnerability.js";
import { shareWeakness } from "./feats/shareWeakness.js";
import { cursedEffigy } from "./feats/cursedEffigy.js";
import { twinWeakness } from "./feats/twinWeakness.js";
import { forceEVTarget } from "./utils/forceEV.js";
import { recallEsotericKnowledge } from "./actions/recallKnowledge.js";
import { rootToLife } from "./feats/rootToLife.js";
import { intensifyImplement } from "./implements/intensifyImplement.js";
import { constructChildImplement } from "./implements/impDict.js";

Hooks.on("init", async () => {
  game.pf2eThaumVuln = {
    exploitVuln,
    shareWeakness,
    cursedEffigy,
    twinWeakness,
    forceEVTarget,
    recallEsotericKnowledge,
    rootToLife,
    intensifyImplement,
  };

  loadTemplates([
    "modules/pf2e-thaum-vuln/templates/implementPartial.hbs",
    "modules/pf2e-thaum-vuln/templates/amuletsAbeyanceDialog.hbs",
  ]);

  /** Wraps the prepareDerivedData function on actors to add implement classes to the actor. */
  libWrapper.register(
    "pf2e-thaum-vuln",
    "CONFIG.PF2E.Actor.documentClasses.character.prototype.prepareDerivedData",
    function (wrapped, ...args) {
      if (
        this.class?.name &&
        this.class?.name
          .split(" ")
          .includes(game.i18n.localize("PF2E.TraitThaumaturge"))
      ) {
        const selectedImplements = this.getFlag(
          "pf2e-thaum-vuln",
          "selectedImplements"
        );
        if (
          selectedImplements &&
          Object.keys(selectedImplements)?.length !== 0
        ) {
          const implementClasses = Object.fromEntries(
            Object.entries(selectedImplements).map(([k, imp]) => [
              k,
              constructChildImplement(k, this, imp.uuid),
            ])
          );
          this.attributes.implements = implementClasses;
          // Get options like "self:implement:tome:rank:2"
          for (const implement of Object.values(implementClasses)) {
            implement.rollOptions.forEach(
              (o) => (this.flags.pf2e.rollOptions.all[o] = true)
            );
          }
        }
      }

      wrapped(...args);
    }
  );

  Handlebars.registerHelper("ifCond", function (v1, v2, options) {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper("ifNCond", function (v1, v2, options) {
    if (v1 !== v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  Handlebars.registerHelper("removeFromArray", function (v1, v2, options) {
    if (v1.includes(v2)) {
      const newArray = v1.splice(v1.indexOf(v2), 1);
      if (v1.length > 0) return options.fn(newArray);
      else return options.inverse(newArray);
    }
    if (v1.length > 0) return options.fn(this);
    else return options.inverse(this);
  });

  //game settings
  game.settings.register("pf2e-thaum-vuln", "0150migration", {
    name: "0.15.0 migration",
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register("pf2e-thaum-vuln", "useEVAutomation", {
    name: game.i18n.localize("pf2e-thaum-vuln.settings.EVAutomation.name"),
    hint: game.i18n.localize("pf2e-thaum-vuln.settings.EVAutomation.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      !value;
    },
  });

  game.settings.register("pf2e-thaum-vuln", "mystifyNumbers", {
    name: game.i18n.localize("pf2e-thaum-vuln.settings.mystifyNumbers.name"),
    hint: game.i18n.localize("pf2e-thaum-vuln.settings.mystifyNumbers.hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      !value;
    },
  });

  game.settings.register("pf2e-thaum-vuln", "esotericLoreModifier", {
    name: game.i18n.localize(
      "pf2e-thaum-vuln.settings.esotericLoreModifier.name"
    ),
    hint: game.i18n.localize(
      "pf2e-thaum-vuln.settings.esotericLoreModifier.hint"
    ),
    scope: "world",
    config: true,
    type: Number,
    default: 0,
  });

  game.settings.register("pf2e-thaum-vuln", "enforceHeldImplement", {
    name: game.i18n.localize(
      "pf2e-thaum-vuln.settings.enforceHeldImplement.name"
    ),
    hint: game.i18n.localize(
      "pf2e-thaum-vuln.settings.enforceHeldImplement.hint"
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: (value) => {
      !value;
    },
  });

  game.settings.register("pf2e-thaum-vuln", "dailiesHandlesTome", {
    name: game.i18n.localize(
      "pf2e-thaum-vuln.settings.dailiesHandlesTome.name"
    ),
    hint: game.i18n.localize(
      "pf2e-thaum-vuln.settings.dailiesHandlesTome.hint"
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      !value;
    },
  });

  game.settings.register("pf2e-thaum-vuln", "reactionCheckerHandlesAmulet", {
    name: game.i18n.localize(
      "pf2e-thaum-vuln.settings.reactionCheckerHandlesAmulet.name"
    ),
    hint: game.i18n.localize(
      "pf2e-thaum-vuln.settings.reactionCheckerHandlesAmulet.hint"
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: (value) => {
      !value;
    },
  });
});
