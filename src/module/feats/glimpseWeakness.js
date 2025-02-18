import { hasFeat } from "../utils/helpers.js";
import { deleteEVEffect } from "../socket.js";
import { preDeleteEffect } from "./exploit-vulnerability/exploitVulnerability.js";
import { createGWOnActor } from "./exploit-vulnerability/helpers.js";
import { GLIMPSE_WEAKNESS_EFFECT_UUID } from "../utils/index.js";

export function glimpseWeakness() {
  if (
    canvas.tokens.controlled.length != 1 ||
    Array.from(game.user.targets).length != 1
  ) {
    return ui.notifications.warn(
      game.i18n.localize(
        "pf2e-thaum-vuln.notifications.warn.exploitVulnerability.targetCount"
      )
    );
  }

  const actor = canvas.tokens.controlled[0].actor;
  const deleteEffectTargs = preDeleteEffect(canvas.tokens.placeables, actor);
  if (deleteEffectTargs.length > 0) {
    deleteEVEffect(deleteEffectTargs.flat());
  }

  const target = Array.from(game.user.targets)[0];
  if (hasFeat(actor, "thaumaturge-dedication")) {
    createGWOnActor(actor, target, GLIMPSE_WEAKNESS_EFFECT_UUID);
  } else {
    return ui.notifications.warn(
      game.i18n.localize(
        "pf2e-thaum-vuln.notifications.warn.glimpseVulnerability.noGlimpseVulnerability"
      )
    );
  }
}
