#ifndef JSON_H
#define JSON_H

#include "scheduler.h"

void print_json_output(struct Process processes[], int n, struct Result *r, int time_quantum, int aging_threshold, const char* algorithm);

#endif
