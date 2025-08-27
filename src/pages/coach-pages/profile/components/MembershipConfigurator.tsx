import React, { useEffect, useState } from "react";
import { Info, Lock, CheckCircle2 } from "lucide-react";

type Period = "monthly" | "yearly";
type GroupPricingModel = "visit_pack" | "monthly_pay" | "count_per_month" | "yearly_membership";

export type ClubSectionsOverview = Array<{
  sectionId: number;
  sectionName: string;
  groups: Array<{ id: number; name: string }>;
}>;

interface GroupModelConfig {
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

export interface MembershipConfig {
  allAccessEnabled: boolean;
  allAccessPeriod: Period;
  allAccessPrice: number | "";
  // Multiple models per group, up to 4
  perGroup: Record<string, GroupModelConfig[]>;
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
    const parsed = JSON.parse(raw) as Partial<MembershipConfig> & Record<string, unknown>;
    const perGroup: Record<string, GroupModelConfig[]> = {};
    const rawPerGroup = parsed.perGroup as unknown;
    if (rawPerGroup && typeof rawPerGroup === "object") {
      Object.entries(rawPerGroup as Record<string, unknown>).forEach(([gid, val]) => {
        if (Array.isArray(val)) {
          perGroup[gid] = val as GroupModelConfig[];
        } else if (val && typeof val === "object" && ("model" in (val as Record<string, unknown>))) {
          // migrate old single-model shape to array
          perGroup[gid] = [val as GroupModelConfig];
        }
      });
    }
    return {
      allAccessEnabled: !!parsed.allAccessEnabled,
      allAccessPeriod: (parsed.allAccessPeriod as Period) || "monthly",
      allAccessPrice: (parsed.allAccessPrice as number | "") ?? "",
      perGroup,
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

  const setGroupModel = (
    groupId: number,
    modelIndex: number,
    partial: Partial<GroupModelConfig>
  ) => {
    setConfig((prev) => {
      const key = String(groupId);
      const models = (prev.perGroup[key] || [{ model: "monthly_pay" }]) as GroupModelConfig[];
      const next: GroupModelConfig[] = models.map((m, i) =>
        i === modelIndex ? { ...m, ...partial, model: partial.model ?? m.model } : m
      );
      return {
        ...prev,
        perGroup: { ...prev.perGroup, [key]: next },
      };
    });
  };

  const addGroupModel = (groupId: number) => {
    setConfig((prev) => {
      const key = String(groupId);
      const current = (prev.perGroup[key] || []) as GroupModelConfig[];
      const used = new Set(current.map((m) => m.model));
      const order: GroupPricingModel[] = [
        "visit_pack",
        "monthly_pay",
        "count_per_month",
        "yearly_membership",
      ];
      const firstAvailable = order.find((m) => !used.has(m)) || "monthly_pay";
      const next = [...current, { model: firstAvailable }];
      return { ...prev, perGroup: { ...prev.perGroup, [key]: next.slice(0, 4) } };
    });
  };

  const removeGroupModel = (groupId: number, modelIndex: number) => {
    setConfig((prev) => {
      const key = String(groupId);
      const current = (prev.perGroup[key] || []) as GroupModelConfig[];
      const next = current.filter((_, i) => i !== modelIndex);
      return { ...prev, perGroup: { ...prev.perGroup, [key]: next.length ? next : [{ model: "monthly_pay" }] } };
    });
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
                      const key = String(g.id);
                      const models = (config.perGroup[key] && config.perGroup[key].length
                        ? config.perGroup[key]
                        : [{ model: "monthly_pay" as GroupPricingModel }]) as GroupModelConfig[];
                      const used = new Set(models.map((m) => m.model));
                      const options: { value: GroupPricingModel; label: string }[] = [
                        { value: "visit_pack", label: "Visit pack" },
                        { value: "monthly_pay", label: "Ежемесячно" },
                        { value: "count_per_month", label: "Кол-во тренировок/мес" },
                        { value: "yearly_membership", label: "Годовая" },
                      ];
                      const canAdd = models.length < 4 && used.size < options.length;
                      return (
                        <div key={g.id} className="p-3 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm font-medium text-gray-900">{g.name}</div>
                            <button
                              onClick={() => addGroupModel(g.id)}
                              disabled={!canAdd}
                              className={`text-sm px-3 py-1 rounded-md border ${canAdd ? "text-blue-600 border-blue-200 hover:bg-blue-50" : "text-gray-400 border-gray-200 cursor-not-allowed"}`}
                            >
                              + Добавить модель
                            </button>
                          </div>

                          <div className="space-y-3">
                            {models.map((m, mIdx) => {
                              const available = new Set< GroupPricingModel | "locked" >();
                              options.forEach((opt) => {
                                if (opt.value === m.model) {
                                  available.add(opt.value);
                                } else if (!used.has(opt.value)) {
                                  available.add(opt.value);
                                } else {
                                  available.add("locked");
                                }
                              });
                              return (
                                <div key={`${g.id}-${mIdx}`} className="rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                                    <div className="text-xs font-semibold text-gray-700">Модель оплаты {mIdx + 1}</div>
                                    {models.length > 1 && (
                                      <button
                                        onClick={() => removeGroupModel(g.id, mIdx)}
                                        className="text-xs text-red-600 hover:underline"
                                      >
                                        Удалить
                                      </button>
                                    )}
                                  </div>
                                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <select
                                      value={m.model}
                                      onChange={(e) =>
                                        setGroupModel(g.id, mIdx, { model: e.target.value as GroupPricingModel })
                                      }
                                      className="border border-gray-300 rounded-lg px-3 py-2"
                                    >
                                      {options.map((opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}
                                          disabled={opt.value !== m.model && used.has(opt.value)}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>

                                    {m.model === "visit_pack" && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          placeholder="Кол-во визитов"
                                          inputMode="numeric"
                                          value={m.packVisits ?? ""}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setGroupModel(g.id, mIdx, {
                                              packVisits: value ? Number(value) : undefined,
                                            });
                                          }}
                                          className="border border-gray-300 rounded-lg px-3 py-2"
                                        />
                                        <input
                                          placeholder="Цена (₸)"
                                          inputMode="numeric"
                                          value={m.packPrice ?? ""}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setGroupModel(g.id, mIdx, {
                                              packPrice: value === "" ? "" : Number(value),
                                            });
                                          }}
                                          className="border border-gray-300 rounded-lg px-3 py-2"
                                        />
                                      </div>
                                    )}

                                    {m.model === "monthly_pay" && (
                                      <input
                                        placeholder="Цена в месяц (₸)"
                                        inputMode="numeric"
                                        value={m.monthlyPrice ?? ""}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(/\D/g, "");
                                          setGroupModel(g.id, mIdx, {
                                            monthlyPrice: value === "" ? "" : Number(value),
                                          });
                                        }}
                                        className="border border-gray-300 rounded-lg px-3 py-2"
                                      />
                                    )}

                                    {m.model === "count_per_month" && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          placeholder="Тренировок/мес"
                                          inputMode="numeric"
                                          value={m.monthlyCount ?? ""}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setGroupModel(g.id, mIdx, {
                                              monthlyCount: value === "" ? "" : Number(value),
                                            });
                                          }}
                                          className="border border-gray-300 rounded-lg px-3 py-2"
                                        />
                                        <input
                                          placeholder="Цена (₸)"
                                          inputMode="numeric"
                                          value={m.monthlyCountPrice ?? ""}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            setGroupModel(g.id, mIdx, {
                                              monthlyCountPrice: value === "" ? "" : Number(value),
                                            });
                                          }}
                                          className="border border-gray-300 rounded-lg px-3 py-2"
                                        />
                                      </div>
                                    )}

                                    {m.model === "yearly_membership" && (
                                      <input
                                        placeholder="Цена в год (₸)"
                                        inputMode="numeric"
                                        value={m.yearlyPrice ?? ""}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(/\D/g, "");
                                          setGroupModel(g.id, mIdx, {
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


