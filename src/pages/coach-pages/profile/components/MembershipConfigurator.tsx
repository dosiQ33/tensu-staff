import React, { useEffect, useState } from "react";
import { Info, Lock, CheckCircle2 } from "lucide-react";

type Period = "monthly" | "yearly";
type GroupPricingModel = "visit_pack" | "monthly_pay" | "count_per_month" | "yearly_membership";

export type ClubSectionsOverview = Array<{
  sectionId: number;
  sectionName: string;
  groups: Array<{ id: number; name: string }>;
}>;

export interface MembershipConfig {
  allAccessEnabled: boolean;
  allAccessPeriod: Period;
  allAccessPrice: number | "";
  perGroup: Record<
    string,
    {
      model: GroupPricingModel;
      // visit_pack
      packVisits?: number | "";
      packPrice?: number | "";
      // monthly_pay
      monthlyPrice?: number | "";
      // count_per_month
      monthlyCount?: number | "";
      monthlyCountPrice?: number | "";
      // yearly_membership
      yearlyPrice?: number | "";
    }
  >;
}

const defaultConfig: MembershipConfig = {
  allAccessEnabled: false,
  allAccessPeriod: "monthly",
  allAccessPrice: "",
  perGroup: {},
};

const pendingKey = "pendingMembershipConfig";
const keyForClub = (clubId: string) => `membershipConfig:${clubId}`;

const readConfig = (clubId?: string): MembershipConfig => {
  try {
    const raw = localStorage.getItem(clubId ? keyForClub(clubId) : pendingKey);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw) as MembershipConfig;
    return {
      allAccessEnabled: !!parsed.allAccessEnabled,
      allAccessPeriod: parsed.allAccessPeriod || "monthly",
      allAccessPrice: parsed.allAccessPrice ?? "",
      perGroup: parsed.perGroup || {},
    };
  } catch {
    return defaultConfig;
  }
};

const writeConfig = (cfg: MembershipConfig, clubId?: string) => {
  const key = clubId ? keyForClub(clubId) : pendingKey;
  localStorage.setItem(key, JSON.stringify(cfg));
};

interface MembershipConfiguratorProps {
  clubId?: string; // if undefined => write to pending storage
  sections?: ClubSectionsOverview; // if undefined or empty => disable per-group controls
}

export const MembershipConfigurator: React.FC<MembershipConfiguratorProps> = ({
  clubId,
  sections,
}) => {
  const [config, setConfig] = useState<MembershipConfig>(() => readConfig(clubId));

  useEffect(() => {
    writeConfig(config, clubId);
  }, [config, clubId]);

  const hasSections = (sections?.length || 0) > 0;

  // const groupIndex: Record<string, { label: string }> = useMemo(() => {
  //   const map: Record<string, { label: string }> = {};
  //   (sections || []).forEach((s) => {
  //     s.groups.forEach((g) => {
  //       map[String(g.id)] = { label: `${s.sectionName} • ${g.name}` };
  //     });
  //   });
  //   return map;
  // }, [sections]);

  const setGroupConfig = (
    groupId: number,
    partial: Partial<MembershipConfig["perGroup"][string]>
  ) => {
    setConfig((prev) => ({
      ...prev,
      perGroup: {
        ...prev.perGroup,
        [String(groupId)]: {
          ...prev.perGroup[String(groupId)],
          ...partial,
          model:
            (partial as { model?: GroupPricingModel }).model ??
            prev.perGroup[String(groupId)]?.model ??
            ("monthly_pay" as GroupPricingModel),
        },
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" size={18} />
            <span className="font-medium text-gray-900">Membership настройка</span>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <input
              id="all-access"
              type="checkbox"
              className="mt-1"
              checked={config.allAccessEnabled}
              onChange={(e) =>
                setConfig((c) => ({ ...c, allAccessEnabled: e.target.checked }))
              }
            />
            <div className="flex-1">
              <label htmlFor="all-access" className="font-medium text-gray-900">
                Весь доступ по клубу
              </label>
              <div className="text-sm text-gray-600 mt-1">
                При активации студент получает доступ ко всем секциям клуба
                на выбранный период.
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={config.allAccessPeriod}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      allAccessPeriod: (e.target.value as Period) || "monthly",
                    }))
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="monthly">На месяц</option>
                  <option value="yearly">На год</option>
                </select>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Цена (₸)"
                    value={config.allAccessPrice}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, "");
                      const numericValue = onlyDigits === "" ? "" : Number(onlyDigits);
                      setConfig((c) => ({ ...c, allAccessPrice: numericValue }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₸</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Info size={14} />
                  {config.allAccessPeriod === "monthly"
                    ? "Оплата раз в месяц"
                    : "Оплата раз в год"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border ${hasSections ? "border-gray-200" : "border-dashed border-gray-300"} overflow-hidden`}>
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!hasSections && <Lock className="text-gray-400" size={18} />}
            <span className="font-medium text-gray-900">Тарифы по группам</span>
          </div>
          {!hasSections && (
            <span className="text-xs text-gray-500">Создайте секции и группы</span>
          )}
        </div>
        <div className="p-4 space-y-4">
          {!hasSections && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Visit pack", "Ежемесячно", "Кол-во тренировок/мес", "Годовая подписка"].map(
                (label) => (
                  <div
                    key={label}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-400"
                  >
                    <div className="font-medium">{label}</div>
                    <div className="text-sm">Недоступно — нет групп</div>
                  </div>
                )
              )}
            </div>
          )}

          {hasSections && (
            <div className="space-y-4">
              {(sections || []).map((s) => (
                <div key={s.sectionId} className="space-y-2">
                  <div className="text-sm font-semibold text-gray-800">
                    {s.sectionName}
                  </div>
                  <div className="space-y-3">
                    {s.groups.map((g) => {
                      const groupCfg = config.perGroup[String(g.id)] || {
                        model: "monthly_pay" as GroupPricingModel,
                      };
                      return (
                        <div
                          key={g.id}
                          className="p-3 rounded-lg border border-gray-200"
                        >
                          <div className="text-sm font-medium text-gray-900 mb-2">
                            {g.name}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <select
                              value={groupCfg.model}
                              onChange={(e) =>
                                setGroupConfig(g.id, {
                                  model: e.target
                                    .value as GroupPricingModel,
                                })
                              }
                              className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                              <option value="visit_pack">Visit pack</option>
                              <option value="monthly_pay">Ежемесячно</option>
                              <option value="count_per_month">
                                Кол-во тренировок/мес
                              </option>
                              <option value="yearly_membership">Годовая</option>
                            </select>

                            {groupCfg.model === "visit_pack" && (
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  placeholder="Кол-во визитов"
                                  inputMode="numeric"
                                  value={groupCfg.packVisits ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setGroupConfig(g.id, {
                                      packVisits: value ? Number(value) : undefined,
                                    });
                                  }}
                                  className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                                <input
                                  placeholder="Цена (₸)"
                                  inputMode="numeric"
                                  value={groupCfg.packPrice ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setGroupConfig(g.id, {
                                      packPrice: value === "" ? "" : Number(value),
                                    });
                                  }}
                                  className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                            )}

                            {groupCfg.model === "monthly_pay" && (
                              <input
                                placeholder="Цена в месяц (₸)"
                                inputMode="numeric"
                                value={groupCfg.monthlyPrice ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "");
                                  setGroupConfig(g.id, {
                                    monthlyPrice: value === "" ? "" : Number(value),
                                  });
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                              />
                            )}

                            {groupCfg.model === "count_per_month" && (
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  placeholder="Тренировок/мес"
                                  inputMode="numeric"
                                  value={groupCfg.monthlyCount ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setGroupConfig(g.id, {
                                      monthlyCount: value === "" ? "" : Number(value),
                                    });
                                  }}
                                  className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                                <input
                                  placeholder="Цена (₸)"
                                  inputMode="numeric"
                                  value={groupCfg.monthlyCountPrice ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setGroupConfig(g.id, {
                                      monthlyCountPrice: value === "" ? "" : Number(value),
                                    });
                                  }}
                                  className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                              </div>
                            )}

                            {groupCfg.model === "yearly_membership" && (
                              <input
                                placeholder="Цена в год (₸)"
                                inputMode="numeric"
                                value={groupCfg.yearlyPrice ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "");
                                  setGroupConfig(g.id, {
                                    yearlyPrice: value === "" ? "" : Number(value),
                                  });
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembershipConfigurator;


