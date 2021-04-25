#include <stdio.h> 
#include <stdlib.h> 
#include <unistd.h> 
#include <sys/wait.h>

int main(int argc,char* argv[]) {
	pid_t pid;
	char* params[argc-1];
	if(argc <= 1){
		printf("Please enter UNIX command\n");
		exit(0);
	}
	pid = fork() ; 
	if (pid < 0) {
    	printf("Error : cannot fork\n");
		exit(1); 
	}
	else if (pid == 0) {
		for(int i=1; i<argc+1; i++){
		params[i-1]=argv[i];
	}
		execvp(argv[1],params);
	} 
	else {
		wait(NULL);
		return(0); 
	}
}
