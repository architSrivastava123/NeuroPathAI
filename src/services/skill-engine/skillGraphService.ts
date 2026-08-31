import { SkillNode } from "@/types";
import { SKILL_CATALOG } from "@/data/seedCatalog";

export class SkillGraphService {
  private skillsMap: Map<string, SkillNode>;

  constructor(skills: SkillNode[] = SKILL_CATALOG) {
    this.skillsMap = new Map(skills.map(s => [s.id, s]));
  }

  getSkill(id: string): SkillNode | undefined {
    return this.skillsMap.get(id);
  }

  getAllSkills(): SkillNode[] {
    return Array.from(this.skillsMap.values());
  }

  /**
   * Returns all direct and transitive prerequisites for a given skill.
   */
  getTransitivePrerequisites(skillId: string, visited: Set<string> = new Set()): string[] {
    if (visited.has(skillId)) return [];
    visited.add(skillId);

    const skill = this.skillsMap.get(skillId);
    if (!skill) return [];

    const directPrereqs = skill.prerequisites || [];
    const allPrereqs = new Set<string>(directPrereqs);

    for (const prereqId of directPrereqs) {
      const upstream = this.getTransitivePrerequisites(prereqId, visited);
      upstream.forEach(u => allPrereqs.add(u));
    }

    return Array.from(allPrereqs);
  }

  /**
   * Topological sort of a subset of skills to ensure prerequisite dependencies are strictly ordered before dependents.
   */
  topologicalSort(skillIds: string[]): string[] {
    const requiredSet = new Set(skillIds);
    // Add all transitive prerequisites
    for (const id of skillIds) {
      const prereqs = this.getTransitivePrerequisites(id);
      prereqs.forEach(p => requiredSet.add(p));
    }

    const inDegree: Map<string, number> = new Map();
    const adjList: Map<string, string[]> = new Map();

    requiredSet.forEach(id => {
      inDegree.set(id, 0);
      adjList.set(id, []);
    });

    requiredSet.forEach(id => {
      const skill = this.skillsMap.get(id);
      if (!skill) return;

      skill.prerequisites.forEach(prereqId => {
        if (requiredSet.has(prereqId)) {
          adjList.get(prereqId)?.push(id);
          inDegree.set(id, (inDegree.get(id) || 0) + 1);
        }
      });
    });

    const queue: string[] = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const sorted: string[] = [];
    while (queue.length > 0) {
      // Sort deterministic by skill importance / depth
      queue.sort((a, b) => {
        const skillA = this.skillsMap.get(a);
        const skillB = this.skillsMap.get(b);
        return (skillB?.importanceWeight || 1) - (skillA?.importanceWeight || 1);
      });

      const curr = queue.shift()!;
      sorted.push(curr);

      const neighbors = adjList.get(curr) || [];
      for (const n of neighbors) {
        const newDeg = (inDegree.get(n) || 1) - 1;
        inDegree.set(n, newDeg);
        if (newDeg === 0) {
          queue.push(n);
        }
      }
    }

    return sorted;
  }

  /**
   * Evaluates missing prerequisites for a skill against a learner's mastered skill set (mastery >= threshold).
   */
  getMissingPrerequisites(skillId: string, learnerMasteredSkills: Set<string>): string[] {
    const skill = this.skillsMap.get(skillId);
    if (!skill) return [];

    return skill.prerequisites.filter(p => !learnerMasteredSkills.has(p));
  }

  /**
   * Calculates the graph depth level from root fundamentals (0 = fundamental root, 1 = direct child, etc.).
   */
  getSkillDepth(skillId: string): number {
    const prereqs = this.skillsMap.get(skillId)?.prerequisites || [];
    if (prereqs.length === 0) return 0;
    return 1 + Math.max(...prereqs.map(p => this.getSkillDepth(p)));
  }
}

export const defaultSkillGraphService = new SkillGraphService();
