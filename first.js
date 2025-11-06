 
    
import random

 
 
 
appliances = ["AC", "Heater", "Oven", "Lights"]
 
timeslots = ["6-7am", "7-8am", "8-9am", "9-10am", "10-11am"]
 
power_usage = {"AC": 3, "Heater": 2, "Oven": 2.5, "Lights": 0.5}
 
comfort_score = {"AC": 5, "Heater": 4, "Oven": 3, "Lights": 2}

population_size = 10
generations = 50
mutation_rate = 0.1
 
def create_gene():
    """Random appliance schedule (ON/OFF for each timeslot)"""
    return {slot: random.choice([0, 1]) for slot in timeslots}

def create_chromosome():
    """One chromosome = schedule for all appliances"""
    return {appliance: create_gene() for appliance in appliances}

def fitness(chromosome):
    """Calculate fitness: maximize comfort, minimize energy"""
    total_energy = 0
    total_comfort = 0
    penalty = 0
    
    for appliance, schedule in chromosome.items():
        for slot, state in schedule.items():
            if state == 1:
                total_energy += power_usage[appliance]
                total_comfort += comfort_score[appliance]
                
    
    for slot in timeslots:
        slot_energy = sum(chromosome[ap][slot] * power_usage[ap] for ap in appliances)
        if slot_energy > 5:
            penalty += 5 
     
    return total_comfort / (1 + total_energy + penalty)

def selection(population):
    """Select top 2 chromosomes"""
    sorted_pop = sorted(population, key=lambda x: fitness(x), reverse=True)
    return sorted_pop[:2]

def crossover(parent1, parent2):
    """Single point crossover at appliance level"""
    point = random.randint(1, len(appliances)-1)
    child1 = {}
    child2 = {}
    for i, app in enumerate(appliances):
        if i < point:
            child1[app] = parent1[app]
            child2[app] = parent2[app]
        else:
            child1[app] = parent2[app]
            child2[app] = parent1[app]
    return child1, child2

def mutate(chromosome):
    for appliance, schedule in chromosome.items():
        if random.random() < mutation_rate:
            slot = random.choice(timeslots)
            schedule[slot] = 1 - schedule[slot]  
    return chromosome
 

 
population = [create_chromosome() for _ in range(population_size)]

for gen in range(generations):
    new_population = []
    for _ in range(population_size // 2):
   
        parent1, parent2 = selection(population)
    
        child1, child2 = crossover(parent1, parent2)
       
        child1 = mutate(child1)
        child2 = mutate(child2)
        new_population.extend([child1, child2])
    population = new_population


best = max(population, key=lambda x: fitness(x))
print("Best Appliance Schedule (Fitness:", fitness(best), "):\n")
for appliance, schedule in best.items():
    print(f"{appliance}: {schedule}")
